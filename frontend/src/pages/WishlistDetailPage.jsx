import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function WishlistDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [reactionLoading, setReactionLoading] = useState({});
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimeout = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/product/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      const wl = data.find((w) => w.id === id);
      setMembers(wl ? wl.members : []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
    // eslint-disable-next-line
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ wishlistId: id, name, imageUrl, price }),
      });
      if (!res.ok) throw new Error("Failed to add product");
      setName("");
      setImageUrl("");
      setPrice("");
      fetchProducts();
      setToastMsg("Product added successfully!");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError(err.message);
      setToastMsg("Failed to add product");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 2000);
    }
    setLoading(false);
  };

  const handleDelete = async (productId) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/product/${id}/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditImageUrl(product.imageUrl || "");
    setEditPrice(product.price || "");
  };

  const handleEditSave = async (productId) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/product/${id}/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            name: editName,
            imageUrl: editImageUrl,
            price: editPrice,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update product");
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  // Fetch comments for a product
  const fetchComments = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/product/${id}/${productId}/comments`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json();
      setComments((prev) => ({ ...prev, [productId]: data }));
    } catch {
      /* ignore */
    }
  };

  // Add a comment to a product
  const handleAddComment = async (productId) => {
    if (!commentText[productId]) return;
    try {
      await fetch(
        `http://localhost:5000/api/product/${id}/${productId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ text: commentText[productId] }),
        }
      );
      setCommentText((prev) => ({ ...prev, [productId]: "" }));
      fetchComments(productId);
    } catch {
      /* ignore */
    }
  };

  // Add or remove emoji reaction
  const handleReaction = async (productId, emoji, increment = true) => {
    setReactionLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      await fetch(
        `http://localhost:5000/api/product/${id}/${productId}/reactions`,
        {
          method: increment ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ emoji }),
        }
      );
      fetchProducts();
    } catch {
      /* ignore */
    }
    setReactionLoading((prev) => ({ ...prev, [productId]: false }));
  };

  // Invite user (mock)
  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteMsg("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/wishlist/${id}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ email: inviteEmail }),
        }
      );
      const data = await res.json();
      setInviteMsg(data.message || "Invited!");
      setInviteEmail("");
      fetchWishlist();
    } catch {
      setInviteMsg("Failed to invite");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header Bar */}
      <div className="bg-blue-700 text-white py-4 px-6 rounded-b-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold">Wishlist Details</h1>
        <p className="text-gray-200 text-sm">Wishlist ID: {id}</p>
      </div>
      <div className="max-w-3xl mx-auto p-4">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-lg z-50 animate-bounce">
            {toastMsg}
          </div>
        )}
        <div className="bg-white/90 rounded-lg shadow-lg p-6 mb-6 border border-blue-200">
          <div className="mb-4">
            <div className="mb-1 font-semibold text-lg">Members:</div>
            <ul className="flex flex-wrap gap-2 mb-2">
              {members.map((m) => (
                <li
                  key={m}
                  className="bg-gray-200 rounded px-2 py-1 text-xs text-gray-700"
                >
                  {m}
                </li>
              ))}
            </ul>
            <form
              onSubmit={handleInvite}
              className="flex gap-2 items-center mb-2"
            >
              <input
                type="email"
                placeholder="Invite by email (mock)"
                className="input input-bordered px-2 py-1 border rounded"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-sm btn-primary">
                Invite
              </button>
            </form>
            {inviteMsg && (
              <div className="text-green-600 text-sm mt-1">{inviteMsg}</div>
            )}
          </div>
          <form
            onSubmit={handleAdd}
            className="flex flex-col sm:flex-row gap-2 mb-4 bg-blue-50 p-4 rounded-lg border border-blue-300 shadow"
          >
            <input
              type="text"
              placeholder="Product name"
              className="input input-bordered px-3 py-2 border rounded w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="url"
              placeholder="Image URL"
              className="input input-bordered px-3 py-2 border rounded w-full"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Price"
              className="input input-bordered px-3 py-2 border rounded w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                "Add Product"
              )}
            </button>
          </form>
          {error && <div className="text-red-500 mb-2">{error}</div>}
        </div>
        <div className="bg-white/90 rounded-lg shadow-lg p-6 border border-blue-200">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          {loading && products.length === 0 ? (
            <div className="flex justify-center items-center h-20">
              <span className="animate-spin text-2xl">⏳</span>
            </div>
          ) : (
            <ul className="space-y-4">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="border rounded p-4 flex flex-col md:flex-row md:items-center gap-4 bg-white shadow-sm"
                >
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    {editingId === p.id ? (
                      <>
                        <input
                          type="text"
                          className="input input-bordered px-2 py-1 border rounded mb-1 w-full"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <input
                          type="url"
                          className="input input-bordered px-2 py-1 border rounded mb-1 w-full"
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                        />
                        <input
                          type="number"
                          className="input input-bordered px-2 py-1 border rounded mb-1 w-full"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleEditSave(p.id)}
                            className="btn btn-sm btn-success"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="btn btn-sm btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-lg">{p.name}</div>
                        <div className="text-gray-600">Price: ${p.price}</div>
                        <div className="text-xs text-gray-500">
                          Added by: {p.addedBy}
                        </div>
                        {p.editedBy && (
                          <div className="text-xs text-gray-400">
                            Edited by: {p.editedBy}
                          </div>
                        )}
                        {/* Emoji reactions */}
                        <div className="flex gap-2 mt-2 items-center flex-wrap">
                          {p.reactions &&
                            Object.entries(p.reactions).map(
                              ([emoji, count]) => (
                                <button
                                  key={emoji}
                                  className="px-2 py-1 rounded bg-gray-100 border text-lg hover:bg-gray-200 focus:outline focus:ring"
                                  onClick={() =>
                                    handleReaction(p.id, emoji, false)
                                  }
                                  disabled={reactionLoading[p.id]}
                                >
                                  {emoji} {count}
                                </button>
                              )
                            )}
                          {["👍", "❤️", "🎉", "😂", "😮"].map((emoji) => (
                            <button
                              key={emoji}
                              className="px-2 py-1 rounded bg-gray-50 border text-lg hover:bg-gray-200 focus:outline focus:ring"
                              onClick={() => handleReaction(p.id, emoji, true)}
                              disabled={reactionLoading[p.id]}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        {/* Comments */}
                        <div className="mt-3">
                          <button
                            className="text-blue-600 text-sm mb-1 hover:underline focus:underline"
                            onClick={() => fetchComments(p.id)}
                            disabled={loading}
                          >
                            {comments[p.id]
                              ? "Refresh Comments"
                              : "Show Comments"}
                          </button>
                          <ul className="text-sm space-y-1 mb-2">
                            {(comments[p.id] || []).map((c) => (
                              <li
                                key={c.id}
                                className="bg-gray-50 rounded px-2 py-1"
                              >
                                <span className="font-semibold">{c.user}:</span>{" "}
                                {c.text}
                              </li>
                            ))}
                          </ul>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddComment(p.id);
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              className="input input-bordered px-2 py-1 border rounded w-full"
                              placeholder="Add a comment..."
                              value={commentText[p.id] || ""}
                              onChange={(e) =>
                                setCommentText((prev) => ({
                                  ...prev,
                                  [p.id]: e.target.value,
                                }))
                              }
                              disabled={loading}
                            />
                            <button
                              type="submit"
                              className="btn btn-sm btn-primary"
                              disabled={loading || !commentText[p.id]?.trim()}
                            >
                              Send
                            </button>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                  {editingId === p.id ? null : (
                    <>
                      <button
                        onClick={() => handleEdit(p)}
                        className="btn btn-sm btn-warning self-start md:self-center hover:bg-yellow-400 focus:outline focus:ring"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-sm btn-error self-start md:self-center hover:bg-red-600 focus:outline focus:ring"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default WishlistDetailPage;
