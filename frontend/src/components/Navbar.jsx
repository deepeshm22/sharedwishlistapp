import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between py-4 mb-6 border-b">
      <Link to="/products" className="font-bold text-lg">
        Home
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/wishlists" className="hover:underline">
          Wishlists
        </Link>
        {user && (
          <span className="text-gray-700 font-medium">
            {user.displayName || user.email || user.uid}
          </span>
        )}
        {user ? (
          <button onClick={handleLogout} className="btn btn-sm btn-outline">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
