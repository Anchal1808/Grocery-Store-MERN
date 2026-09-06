import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets, dummyAddress } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

const Checkout = () => {
  const {
    user,
    token,
    cartItems,
    products,
    getCartAmount,
    currency,
    deliveryFee,
    backendUrl,
    setcartItems,
  } = useAppContext();

  const navigate = useNavigate();

  // Pre-fill with dummyAddress if available, or empty fields
  const initialAddress = dummyAddress && dummyAddress[0] ? dummyAddress[0] : {};

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || initialAddress.firstName || "",
    lastName: user?.name?.split(" ")[1] || initialAddress.lastName || "",
    email: user?.email || initialAddress.email || "",
    street: initialAddress.street || "",
    city: initialAddress.city || "",
    state: initialAddress.state || "",
    zipcode: initialAddress.zipcode || "",
    country: initialAddress.country || "IN",
    phone: initialAddress.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // Compute cart items list
  const orderItems = [];
  for (const itemId in cartItems) {
    if (cartItems[itemId] > 0) {
      const product = products.find((p) => String(p._id) === String(itemId));
      if (product) {
        orderItems.push({
          product,
          quantity: cartItems[itemId],
          _id: itemId,
        });
      }
    }
  }

  const subtotal = getCartAmount();
  const appliedDelivery = subtotal > 50 || subtotal === 0 ? 0 : deliveryFee;
  const grandTotal = subtotal + appliedDelivery;

  useEffect(() => {
    if (!token) {
      toast.error("Please login to proceed with checkout");
      navigate("/cart");
    } else if (orderItems.length === 0) {
      navigate("/cart");
    }
  }, [token, orderItems.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        items: orderItems,
        amount: grandTotal,
        address: formData,
        paymentType: paymentMethod,
      };

      const response = await axios.post(`${backendUrl}/api/order/place`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Order placed successfully!");
        setcartItems({});
        navigate("/my-orders");
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Delivery & Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left: Delivery Address Form */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <img src={assets.add_address_iamge} alt="Address" className="w-6 h-6 object-contain" />
            <h2 className="text-lg font-bold text-gray-900">Delivery Information</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address</label>
              <input
                type="text"
                required
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="House No, Street, Apartment"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                <input
                  type="text"
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Maharashtra"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Zip Code</label>
                <input
                  type="text"
                  required
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="400001"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-4">Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setPaymentMethod("COD")}
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${
                  paymentMethod === "COD"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Cash on Delivery (COD)</p>
                  <p className="text-xs text-gray-400">Pay cash or UPI upon delivery</p>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod("Online")}
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${
                  paymentMethod === "Online"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "Online"}
                  onChange={() => setPaymentMethod("Online")}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Online Payment</p>
                  <p className="text-xs text-gray-400">Credit/Debit Card, Netbanking, UPI</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
            Items in Order ({orderItems.length})
          </h3>

          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 my-2 scrollbar-none">
            {orderItems.map((item) => (
              <div key={item._id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 truncate pr-2">
                  <img
                    src={Array.isArray(item.product.image) ? item.product.image[0] : item.product.image}
                    alt=""
                    className="w-9 h-9 object-contain bg-gray-50 rounded p-1 flex-shrink-0"
                  />
                  <span className="truncate text-gray-700">{item.product.name}</span>
                  <span className="text-gray-400 font-semibold">x{item.quantity}</span>
                </div>
                <span className="font-semibold text-gray-900 flex-shrink-0">
                  {currency}{item.product.offerPrice * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 py-4 text-sm text-gray-600 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">{currency}{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>
                {appliedDelivery === 0 ? (
                  <span className="text-emerald-600 font-medium">FREE</span>
                ) : (
                  `${currency}${appliedDelivery}`
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-between py-4 border-t border-gray-100 text-base font-bold text-gray-900">
            <span>Total Payable</span>
            <span className="text-xl text-primary">{currency}{grandTotal}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-dull text-white font-semibold rounded-xl text-sm transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Placing Order..." : `Place Order (${currency}${grandTotal})`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
