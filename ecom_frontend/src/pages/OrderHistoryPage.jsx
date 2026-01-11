import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return <div className="text-center mt-10">Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Order History</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200"
            >
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <div>
                  <span className="text-sm text-gray-500">
                    Order ID: #{order.id}
                  </span>
                  <div className="text-sm text-gray-500">
                    Date: {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-600 text-xl">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity} x {item.product.name}
                    </span>
                    <span className="text-gray-600">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
