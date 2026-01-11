import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";

const ProductCard = ({ product, isAdmin, onDelete, onEdit }) => {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (product.stockQuantity <= 0) {
      toast.warning("This product is out of stock.");
      return;
    }

    try {
      setAdding(true);
      // Query params match the Backend Controller: ?productId=...&quantity=...
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="h-48 overflow-hidden bg-gray-200">
        <img
          src={
            product.imageUrl || "https://via.placeholder.com/300?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
            OUT OF STOCK
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mt-1 h-12 overflow-hidden">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-indigo-600 font-bold text-xl">
            ${product.price}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Stock: {product.stockQuantity}
          </span>
        </div>
        <div className="mt-auto pt-4">
          {isAdmin ? (
            <div className="mt-4 flex gap-2 border-t pt-3">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 bg-yellow-500 text-white text-sm py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 bg-red-500 text-white text-sm py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stockQuantity === 0}
              className={`w-full py-2 rounded text-white font-semibold transition-colors ${
                product.stockQuantity === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
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
