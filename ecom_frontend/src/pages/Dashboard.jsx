import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import ProductModal from "../components/ProductModal";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // Null = Add, Object = Edit

  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const fetchProducts = async (page = 0, search = "") => {
    try {
      setLoading(true);
      const response = await api.get(
        `/products?page=${page}&size=8&search=${search}`
      );

      if (response.data.content) {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setProducts(response.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load products.");
      if (error.response && error.response.status === 403) {
        logout(); // Token likely expired
      }
      setLoading(false);
    }
  };

  // Initial Load & Search Effect
  useEffect(() => {
    // Debounce search to prevent API spam
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(0); // Reset to page 1 on new search
      fetchProducts(0, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Pagination Effect
  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [currentPage]);

  // 🔴 Delete Handler (Admin Only)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted successfully");
        fetchProducts(currentPage, searchTerm); // Refresh list
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  // 🟢 Open Modal for Adding
  const handleAddNew = () => {
    setCurrentProduct(null); // Ensure form is empty
    setIsModalOpen(true);
  };

  // 🟢 Open Modal for Editing
  const handleEdit = (product) => {
    setCurrentProduct(product); // Fill form with data
    setIsModalOpen(true);
  };

  // 🟢 Save Logic (Create or Update)
  const handleSaveProduct = async (productData) => {
    try {
      // 1. Convert strings to numbers for the Backend
      const payload = {
        ...productData,
        price: parseFloat(productData.price),
        stockQuantity: parseInt(productData.stockQuantity),
      };

      if (currentProduct) {
        // UPDATE Existing
        await api.put(`/products/${currentProduct.id}`, payload);
        toast.success("Product updated successfully!");
      } else {
        // CREATE New
        await api.post("/products", payload);
        toast.success("Product added successfully!");
      }

      setIsModalOpen(false);
      fetchProducts(currentPage, searchTerm); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Product Dashboard</h1>

        <div className="flex gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Add Button (Admin Only) */}
          {isAdmin && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap"
              onClick={handleAddNew}
            >
              + Add Product
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-500 mt-10">
          Loading inventory...
        </div>
      ) : (
        <>
          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No products found matching "{searchTerm}"
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {/* 🟢 Render Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={currentProduct}
      />
    </div>
  );
};

export default Dashboard;
