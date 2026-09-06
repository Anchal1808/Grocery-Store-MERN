import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, cartItems } = useAppContext();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (products && products.length > 0) {
      const found = products.find((p) => String(p._id) === String(id));
      if (found) {
        setProduct(found);
        setSelectedImage(Array.isArray(found.image) ? found.image[0] : found.image);
      }
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  const quantity = cartItems[product._id] || 0;
  const images = Array.isArray(product.image) ? product.image : [product.image];
  const discountPercent = Math.round(((product.price - product.offerPrice) / product.price) * 100);

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && String(p._id) !== String(product._id))
    .slice(0, 4);

  return (
    <div className="py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
        <span className="hover:text-primary cursor-pointer" onClick={() => navigate("/")}>
          Home
        </span>
        <span>/</span>
        <span
          className="hover:text-primary cursor-pointer"
          onClick={() => navigate(`/products/${product.category.toLowerCase()}`)}
        >
          {product.category}
        </span>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-96 scrollbar-none">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border p-2 flex items-center justify-center cursor-pointer transition bg-gray-50 flex-shrink-0 ${
                    selectedImage === img ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-6 flex items-center justify-center min-h-80 sm:min-h-96">
            <img
              src={selectedImage || images[0]}
              alt={product.name}
              className="max-h-72 sm:max-h-88 object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Product Meta & Actions */}
        <div className="flex flex-col">
          <span className="text-xs uppercase font-bold tracking-widest text-primary mb-2">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    className="w-4 h-4"
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="star"
                  />
                ))}
            </div>
            <span className="text-xs font-semibold text-gray-500">(128 customer reviews)</span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3 pb-5 border-b border-gray-100">
            <span className="text-3xl sm:text-4xl font-bold text-gray-900">
              {currency}{product.offerPrice}
            </span>
            {product.price > product.offerPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {currency}{product.price}
                </span>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Bullet Descriptions */}
          <div className="py-5 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Product Highlights:</h4>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {product.description && product.description.length > 0 ? (
                product.description.map((point, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">100% farm-fresh quality produce.</li>
              )}
            </ul>
          </div>

          {/* Cart & Buy Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addToCart(product._id)}
              className="flex-1 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-dull text-white font-semibold text-sm transition shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <img src={assets.cart_icon} alt="" className="w-4 h-4 filter brightness-0 invert" />
              <span>{quantity > 0 ? `Added (${quantity}) - Add More` : "Add to Cart"}</span>
            </button>
            <button
              onClick={() => {
                if (quantity === 0) {
                  addToCart(product._id);
                }
                navigate("/cart");
              }}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-sm transition shadow flex items-center justify-center cursor-pointer"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2.5">
              <img src={assets.delivery_truck_icon} alt="" className="w-6 h-6 object-contain" />
              <div>
                <p className="font-semibold text-gray-800">Superfast Delivery</p>
                <p className="text-gray-400">Under 30 mins delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <img src={assets.trust_icon} alt="" className="w-6 h-6 object-contain" />
              <div>
                <p className="font-semibold text-gray-800">Quality Assured</p>
                <p className="text-gray-400">100% replacement guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
