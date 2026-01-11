import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch Cart (This gets the LATEST product stock info from DB)
  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      toast.success("Item removed");
      fetchCart();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await api.post("/orders/place");
      toast.success("Order placed successfully!");
      setCart(null);
      navigate("/orders");
    } catch (error) {
      // Backend double-checks stock, so this catches race conditions
      toast.error(error.response?.data?.message || "Failed to place order.");
      fetchCart(); // Refresh to see updated stock
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  // 2. Check if ANY item in the cart has issues
  const hasStockIssues = cart?.items?.some(
    (item) => item.quantity > item.product.stockQuantity
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">
          Shopping Cart
        </h1>

        <div className="border border-gray-200">
          <div className="divide-y divide-gray-200">
            {cart.items.map((item) => {
              // 3. Check specific item stock status
              const currentStock = item.product.stockQuantity;
              const isOutOfStock = item.quantity > currentStock;

              return (
                <div
                  key={item.id}
                  className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
                    isOutOfStock ? "bg-red-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <img
                        src={
                          item.product.imageUrl ||
                          "https://via.placeholder.com/100"
                        }
                        alt={item.product.name}
                        className={`w-24 h-24 object-cover bg-gray-50 ${
                          isOutOfStock ? "opacity-50" : ""
                        }`}
                      />
                      {isOutOfStock && (
                        <span className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 font-bold">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        ${item.product.price} × {item.quantity}
                      </p>

                      {/* 4. Display Stock Warning Text */}
                      {isOutOfStock ? (
                        <p className="text-red-600 text-sm font-bold mt-1">
                          {currentStock === 0
                            ? "Item is currently unavailable."
                            : `Only ${currentStock} left in stock! Reduce quantity.`}
                        </p>
                      ) : (
                        /* Optional: Low stock warning */
                        currentStock < 5 && (
                          <p className="text-orange-600 text-xs mt-1">
                            Hurry! Only {currentStock} left.
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer / Checkout */}
          <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
            <div className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
              Total: ${calculateTotal().toFixed(2)}
            </div>

            {/* 5. Disable Button if any stock issues exist */}
            <button
              onClick={handlePlaceOrder}
              disabled={hasStockIssues}
              className={`px-8 py-2.5 text-sm font-medium transition-colors ${
                hasStockIssues
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {hasStockIssues ? "Fix Stock Issues" : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
