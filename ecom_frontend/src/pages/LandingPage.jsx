import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import ProductModal from "../components/ProductModal";

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  const fetchProducts = async (search = "") => {
    try {
      setLoading(true);
      const response = await api.get(`/products?search=${search}&size=12`);
      setProducts(response.data.content || response.data);
    } catch (error) {
      console.error("Error fetching products", error);
      toast.error("Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Delete product?")) {
      await api.delete(`/products/${id}`);
      fetchProducts(searchTerm);
    }
  };

  const handleSaveProduct = async (data) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
      stockQuantity: parseInt(data.stockQuantity),
    };
    if (currentProduct)
      await api.put(`/products/${currentProduct.id}`, payload);
    else await api.post("/products", payload);
    setIsModalOpen(false);
    fetchProducts(searchTerm);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                E-Com
              </h1>
              <p className="text-gray-600 mt-2 text-sm">
                Browse our exclusive collection
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2.5 border border-gray-300 text-sm w-full md:w-80 focus:outline-none focus:border-gray-400 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isAdmin && (
                <button
                  onClick={() => {
                    setCurrentProduct(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-gray-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  Add Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onEdit={(p) => {
                  setCurrentProduct(p);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Admin Modal */}
      {isAdmin && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          product={currentProduct}
        />
      )}
    </div>
  );
};

export default LandingPage;
