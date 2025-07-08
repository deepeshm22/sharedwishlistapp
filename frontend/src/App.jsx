import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import WishlistsPage from "./pages/WishlistsPage";
import WishlistDetailPage from "./pages/WishlistDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductPage from "./pages/ProductPage";

function App() {
  // TODO: Add auth state and protected routes
  return (
    <Router>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlists"
            element={
              <ProtectedRoute>
                <WishlistsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlists/:id"
            element={
              <ProtectedRoute>
                <WishlistDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/products" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
