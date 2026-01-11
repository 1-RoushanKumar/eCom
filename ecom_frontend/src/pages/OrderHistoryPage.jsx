import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders", {
          params: { page, size: 5 },
        });
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">
          Order History
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start pb-4 mb-4 border-b border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Order #{order.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-lg mb-1">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    <span className="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 font-medium">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm items-center"
                    >
                      <span className="text-gray-900">
                        {item.quantity} × {item.product.name}
                      </span>
                      <span className="text-gray-600 font-medium">
                        ${item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-10">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
