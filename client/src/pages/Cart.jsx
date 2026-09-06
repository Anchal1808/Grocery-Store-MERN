import React from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    products,
    cartItems,
    currency,
    updateCartItem,
    getCartAmount,
    getCartCount,
    deliveryFee,
    user,
    setshowUserLogin,
  } = useAppContext();

  const navigate = useNavigate();

  const cartProductList = [];
  for (const itemId in cartItems) {
    if (cartItems[itemId] > 0) {
      const product = products.find((p) => String(p._id) === String(itemId));
      if (product) {
        cartProductList.push({
          ...product,
          quantity: cartItems[itemId],
        });
      }
    }
  }

  const subtotal = getCartAmount();
  const appliedDelivery = subtotal > 50 || subtotal === 0 ? 0 : deliveryFee;
  const grandTotal = subtotal > 0 ? subtotal + appliedDelivery : 0;

  const handleCheckout = () => {
    if (!user) {
      setshowUserLogin(true);
      return;
    }
    navigate("/checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (cartProductList.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <img src={assets.nav_cart_icon} alt="Empty Cart" className="w-12 h-12 opacity-60" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Basket is Empty</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-sm">
          Looks like you haven't added any groceries to your cart yet. Explore our fresh categories and fill it up!
        </p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-8 py-3 bg-primary hover:bg-primary-dull text-white font-semibold rounded-xl text-sm transition shadow cursor-pointer"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Shopping Cart ({getCartCount()} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartProductList.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-xs gap-4"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex items-center justify-center cursor-pointer flex-shrink-0"
                >
                  <img
                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h4
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="font-medium text-gray-900 text-sm sm:text-base truncate cursor-pointer hover:text-primary transition"
                  >
                    {item.name}
                  </h4>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {currency}{item.offerPrice}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => updateCartItem(item._id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-gray-200 text-gray-700 font-bold text-sm transition cursor-pointer shadow-xs"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold text-sm text-gray-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateCartItem(item._id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-gray-200 text-gray-700 font-bold text-sm transition cursor-pointer shadow-xs"
                >
                  +
                </button>
              </div>

              {/* Total & Remove */}
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900 text-base min-w-16 text-right">
                  {currency}{item.offerPrice * item.quantity}
                </span>
                <button
                  onClick={() => updateCartItem(item._id, 0)}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  title="Remove item"
                >
                  <img src={assets.remove_icon} alt="remove" className="w-4 h-4 opacity-70" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
            Order Summary
          </h3>

          <div className="space-y-3 py-4 text-sm text-gray-600 border-b border-gray-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">{currency}{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>
                {appliedDelivery === 0 ? (
                  <span className="text-emerald-600 font-medium">FREE</span>
                ) : (
                  `${currency}${appliedDelivery}`
                )}
              </span>
            </div>
            {subtotal < 50 && (
              <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg">
                Add {currency}{50 - subtotal} more to qualify for <strong>FREE Delivery</strong>!
              </p>
            )}
          </div>

          <div className="flex justify-between py-4 text-base font-bold text-gray-900">
            <span>Total Amount</span>
            <span className="text-xl text-primary">{currency}{grandTotal}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-3.5 bg-primary hover:bg-primary-dull text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Proceed to Checkout</span>
            <span>&rarr;</span>
          </button>

          <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
            <img src={assets.trust_icon} alt="" className="w-4 h-4 opacity-60" />
            100% Safe & Secure Checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
