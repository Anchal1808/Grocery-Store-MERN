import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  if (!product) return null;

  const handleNavigate = () => {
    navigate(`/product/${product._id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quantity = cartItems[product._id] || 0;

  return (
    <div className="border border-gray-200 hover:shadow-lg transition-all duration-200 rounded-xl p-3 sm:p-4 bg-white flex flex-col justify-between group">
      {/* Product Image */}
      <div
        onClick={handleNavigate}
        className="cursor-pointer flex items-center justify-center p-2 h-44 sm:h-48 overflow-hidden rounded-lg bg-gray-50 group-hover:bg-primary/5 transition"
      >
        <img
          className="max-h-36 sm:max-h-40 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          src={Array.isArray(product.image) ? product.image[0] : product.image}
          alt={product.name}
        />
      </div>

      {/* Product Info */}
      <div className="mt-3 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-xs uppercase font-semibold tracking-wider text-gray-400">
            {product.category}
          </p>
          <h3
            onClick={handleNavigate}
            title={product.name}
            className="text-gray-800 font-medium text-base truncate mt-1 cursor-pointer hover:text-primary transition"
          >
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-3.5 h-3.5"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                />
              ))}
            <span className="text-xs text-gray-400 font-medium ml-0.5">(4.5)</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
          <div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {currency}{product.offerPrice}
            </span>
            {product.price > product.offerPrice && (
              <span className="ml-1.5 text-xs text-gray-400 line-through">
                {currency}{product.price}
              </span>
            )}
          </div>

          <div>
            {quantity === 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id);
                }}
                className="flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer"
              >
                <img src={assets.add_icon} alt="add" className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 bg-primary text-white px-2 py-1 rounded-lg select-none shadow-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(product._id);
                  }}
                  className="cursor-pointer font-bold px-1.5 hover:bg-black/10 rounded transition text-sm leading-none"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-4 text-center font-bold text-sm leading-none">
                  {quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product._id);
                  }}
                  className="cursor-pointer font-bold px-1.5 hover:bg-black/10 rounded transition text-sm leading-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;