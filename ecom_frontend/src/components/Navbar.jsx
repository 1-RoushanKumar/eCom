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
    <nav className="bg-indigo-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Inventory App
        </Link>
        <div className="space-x-4">
          {!token ? (
            <>
              <Link to="/login" className="text-white hover:text-indigo-200">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-indigo-200">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:text-indigo-200"
              >
                Dashboard
              </Link>
              <Link to="/cart" className="mr-4 hover:text-indigo-200">
                Cart
              </Link>
              <Link to="/orders" className="mr-4 hover:text-indigo-200">
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
