import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProductCard = ({ product, isAdmin, onDelete, onEdit }) => {
  const [adding, setAdding] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    // 2. Check Stock
    if (isOutOfStock) {
      toast.warning("This product is out of stock.");
      return;
    }

    try {
      setAdding(true);
      await api.post(`/cart/add?productId=${product.id}&quantity=1`);
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <img
          src={
            product.imageUrl || "https://via.placeholder.com/300?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <span className="text-gray-700 font-medium text-sm tracking-wide">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed h-10 overflow-hidden mb-4">
          {product.description}
        </p>

        <div className="flex justify-between items-baseline mb-4">
          <span className="text-gray-900 font-semibold text-lg">
            ₹{product.price}
          </span>
          <span className="text-xs text-gray-500">
            {product.stockQuantity} in stock
          </span>
        </div>

        <div className="mt-auto">
          {isAdmin ? (
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm py-2 font-medium hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 bg-white border border-gray-300 text-red-600 text-sm py-2 font-medium hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stockQuantity === 0}
              className={`w-full py-2.5 text-sm font-medium transition-colors ${
                product.stockQuantity === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
