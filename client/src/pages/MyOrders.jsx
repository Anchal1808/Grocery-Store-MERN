import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyOrders } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyOrders = () => {
  const { token, currency, backendUrl, user, setshowUserLogin } = useAppContext();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (token) {
        const response = await axios.get(`${backendUrl}/api/order/user-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success && response.data.orders.length > 0) {
          setOrders(response.data.orders);
        } else {
          setOrders(dummyOrders);
        }
      } else {
        setOrders(dummyOrders);
      }
    } catch (error) {
      console.warn("Failed to fetch user orders from backend, showing mock orders:", error.message);
      setOrders(dummyOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "Out for Delivery":
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-amber-100 text-amber-700 border-amber-300";
    }
  };

  if (!user && !token && orders.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <img src={assets.order_icon} alt="" className="w-10 h-10 opacity-70" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Track Your Orders</h2>
        <p className="text-gray-500 text-sm mt-1 max-w-sm">
          Please sign in to view your past orders, delivery tracking, and receipt history.
        </p>
        <button
          onClick={() => setshowUserLogin(true)}
          className="mt-6 px-8 py-3 bg-primary hover:bg-primary-dull text-white font-semibold rounded-xl text-sm transition shadow cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Review your order history and track deliveries</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline cursor-pointer"
        >
          <img src={assets.refresh_icon} alt="" className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <img src={assets.box_icon} alt="No orders" className="w-16 h-16 opacity-40 mb-4" />
          <h3 className="text-lg font-bold text-gray-800">No orders placed yet</h3>
          <p className="text-gray-500 text-sm mt-1">When you place an order, it will appear right here.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dull transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">
                      Order #{String(order._id).slice(-8).toUpperCase()}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{dateStr}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status || "Order Placed"}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                      {order.paymentType} {order.isPaid ? "(Paid)" : "(Unpaid)"}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="py-4 divide-y divide-gray-50 space-y-3">
                  {order.items.map((item, idx) => {
                    const productData = item.product || {};
                    const img = Array.isArray(productData.image)
                      ? productData.image[0]
                      : productData.image || assets.box_icon;

                    return (
                      <div
                        key={idx}
                        className="pt-3 flex items-center justify-between gap-4 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gray-50 rounded-xl p-1.5 flex items-center justify-center flex-shrink-0">
                            <img
                              src={img}
                              alt={productData.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              {productData.name || "Grocery Item"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Quantity: <span className="font-semibold text-gray-700">{item.quantity}</span>
                              {" "}• {currency}{productData.offerPrice || productData.price || 0} each
                            </p>
                          </div>
                        </div>

                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          {currency}{(productData.offerPrice || productData.price || 0) * item.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer & Actions */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="text-gray-500">
                    Delivery to:{" "}
                    <span className="font-medium text-gray-800">
                      {order.address?.street}, {order.address?.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-gray-400 mr-1">Total:</span>
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        {currency}{order.amount}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate("/products")}
                      className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-semibold text-xs transition cursor-pointer"
                    >
                      Shop More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
