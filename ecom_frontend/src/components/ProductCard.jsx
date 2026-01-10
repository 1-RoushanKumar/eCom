import React from "react";

const ProductCard = ({ product, isAdmin, onDelete, onEdit }) => {
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
        {isAdmin && (
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
        )}
      </div>
    </div>
  );
};

export default ProductCard;
