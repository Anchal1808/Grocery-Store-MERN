import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products, navigate } = useAppContext();

  // Show top 8 best selling items
  const bestSellers = products?.slice(0, 8) || [];

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best Sellers</h2>
          <p className="text-gray-500 text-sm mt-1">Our most popular grocery items loved by customers</p>
        </div>
        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-primary hover:text-primary-dull text-sm font-semibold hover:underline cursor-pointer"
        >
          See More &rarr;
        </button>
      </div>

      {bestSellers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">Loading products...</div>
      )}
    </section>
  );
};

export default BestSeller;