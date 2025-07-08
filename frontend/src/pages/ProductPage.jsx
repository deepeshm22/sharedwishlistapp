import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

function ProductPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWishlist, setSelectedWishlist] = useState("");
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimeout = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await res.json();
        setProducts(data);
      } catch {
        setError("Failed to fetch products");
      }
      setLoading(false);
    };
    fetchProducts();
  }, [user]);

  useEffect(() => {
    const fetchWishlists = async () => {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setWishlists(data);
      } catch {
        setWishlists([]);
      }
    };
    fetchWishlists();
  }, [user]);

  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setSelectedWishlist("");
    setSuccessMsg("");
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    if (!selectedWishlist) return;
    setAdding(true);
    setSuccessMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          wishlistId: selectedWishlist,
          name: selectedProduct.name,
          imageUrl: selectedProduct.imageUrl,
          price: selectedProduct.price,
        }),
      });
      if (!res.ok) throw new Error("Failed to add product");
      setSuccessMsg("Product added to wishlist!");
      setToastMsg("Product added to wishlist!");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 2000);
      setTimeout(() => {
        setShowModal(false);
        navigate(`/wishlists/${selectedWishlist}`);
      }, 1200);
    } catch {
      setSuccessMsg("Failed to add product");
      setToastMsg("Failed to add product");
      setShowToast(true);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 2000);
    }
    setAdding(false);
  };

  return (
    <div>
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-lg z-50 animate-bounce">
          {toastMsg}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {loading ? (
        <div className="flex justify-center items-center h-20">
          <span className="animate-spin text-2xl">⏳</span>
        </div>
      ) : error ? (
        <div className="text-red-500 mb-2">{error}</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-32 h-32 object-cover mb-2 rounded"
              />
              <div className="font-semibold mb-1 text-center">
                {product.name}
              </div>
              <div className="text-gray-600 mb-2">${product.price}</div>
              <button
                className="btn btn-primary w-full"
                onClick={() => handleAddClick(product)}
              >
                Add to Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Modal for selecting wishlist */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
              disabled={adding}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2">Add to Wishlist</h2>
            <form onSubmit={handleAddToWishlist}>
              <label className="block mb-2">Select Wishlist:</label>
              <select
                className="input input-bordered w-full mb-4"
                value={selectedWishlist}
                onChange={(e) => setSelectedWishlist(e.target.value)}
                required
                disabled={adding}
              >
                <option value="">-- Select --</option>
                {wishlists.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={adding || !selectedWishlist}
              >
                {adding ? <span className="animate-spin">⏳</span> : "Add"}
              </button>
            </form>
            {successMsg && (
              <div className="text-green-600 mt-2 text-center">
                {successMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
