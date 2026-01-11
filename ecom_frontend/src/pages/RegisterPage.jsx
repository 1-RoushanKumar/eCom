import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success("Registration Successful!");
      navigate("/");
    } catch (err) {
      toast.error("Registration Failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md px-8">
        <div className="border border-gray-200 bg-white p-8">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900 tracking-tight">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Role
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="USER">User (Read Only)</option>
                <option value="ADMIN">Admin (Full Access)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
