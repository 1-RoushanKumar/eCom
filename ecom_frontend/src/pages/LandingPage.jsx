import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import ProductModal from "../components/ProductModal";

const LandingPage = () => {
  const { user } = useContext(AuthContext); // We just need user to check if Admin
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  const fetchProducts = async (search = "") => {
    try {
      setLoading(true);
      // This endpoint is now public thanks to Step 1
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

  // --- Admin Logic (Only works if isAdmin is true) ---
  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Delete product?")) {
        await api.delete(`/products/${id}`);
        fetchProducts(searchTerm);
    }
  };

  const handleSaveProduct = async (data) => {
      const payload = {...data, price: parseFloat(data.price), stockQuantity: parseInt(data.stockQuantity)};
      if(currentProduct) await api.put(`/products/${currentProduct.id}`, payload);
      else await api.post("/products", payload);
      setIsModalOpen(false);
      fetchProducts(searchTerm);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero / Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-bold text-gray-800">Welcome to E-Com</h1>
            <p className="text-gray-500 mt-1">Browse our exclusive collection</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border border-gray-300 rounded-lg w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isAdmin && (
            <button onClick={() => { setCurrentProduct(null); setIsModalOpen(true);}} className="bg-green-600 text-white px-4 py-2 rounded-lg">
              + Add
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-10">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdmin={isAdmin}
              onDelete={handleDelete}
              onEdit={(p) => { setCurrentProduct(p); setIsModalOpen(true); }}
            />
          ))}
        </div>
      )}

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