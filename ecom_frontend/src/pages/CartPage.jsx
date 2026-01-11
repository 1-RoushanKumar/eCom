import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart", error);
      // Don't toast error here, cart might just be empty/new
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
      fetchCart(); // Refresh cart
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await api.post("/orders/place");
      toast.success("Order placed successfully!");
      setCart(null); // Clear local cart view
      navigate("/orders"); // Redirect to Order History
    } catch (error) {
      toast.error("Failed to place order. Check stock availability.");
    }
  };

  // Helper to calculate total
  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (loading) return <div className="text-center mt-10">Loading cart...</div>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-gray-700">Your Cart is Empty</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Go back to shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Cart Items List */}
        <div className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={
                    item.product.imageUrl || "https://via.placeholder.com/100"
                  }
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-bold text-lg">{item.product.name}</h3>
                  <p className="text-gray-500">
                    ${item.product.price} x {item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="font-bold text-lg text-indigo-600">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Checkout */}
        <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
          <div className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold shadow-lg transform active:scale-95 transition-all"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
