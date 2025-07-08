import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function WishlistsPage() {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWishlists = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setWishlists(data);
    } catch {
      setError("Failed to fetch wishlists");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlists();
    // eslint-disable-next-line
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create wishlist");
      setName("");
      fetchWishlists();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Your Wishlists</h1>
        {user && (
          <span className="text-gray-600">
            {user.displayName || user.email || user.uid}
          </span>
        )}
      </div>
      <form
        onSubmit={handleCreate}
        className="flex flex-col sm:flex-row gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="New wishlist name"
          className="input input-bordered px-3 py-2 border rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !name.trim()}
        >
          {loading ? <span className="animate-spin">⏳</span> : "Add"}
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && wishlists.length === 0 ? (
        <div className="flex justify-center items-center h-20">
          <span className="animate-spin text-2xl">⏳</span>
        </div>
      ) : (
        <ul className="space-y-2">
          {wishlists.map((w) => (
            <li
              key={w.id}
              className="border rounded p-3 flex flex-col sm:flex-row justify-between items-center gap-2"
            >
              <Link
                to={`/wishlists/${w.id}`}
                className="font-semibold hover:underline"
              >
                {w.name}
              </Link>
              <span className="text-xs text-gray-500">Owner: {w.owner}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WishlistsPage;
