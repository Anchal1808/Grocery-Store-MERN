import React from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <section id="categories-section" className="mt-16 scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 text-sm mt-1">Explore our wide variety of farm-fresh essentials</p>
        </div>
        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-primary hover:text-primary-dull text-sm font-semibold hover:underline cursor-pointer"
        >
          View All &rarr;
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer py-5 px-3 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-black/5"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="h-20 sm:h-24 flex items-center justify-center">
              <img
                src={category.image}
                alt={category.text}
                className="group-hover:scale-110 transition-transform duration-300 max-h-18 sm:max-h-20 object-contain"
              />
            </div>
            <p className="text-sm font-semibold text-gray-800 mt-2">{category.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;