import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-gray-900 text-3xl font-semibold tracking-tight"
          >
            E-Com
          </Link>
          <div className="flex items-center gap-8">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/cart"
                  className="text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors"
                >
                  Cart
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
