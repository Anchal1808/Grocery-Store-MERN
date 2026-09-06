import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const { category: urlCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const { products } = useAppContext();

  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory ? urlCategory.toLowerCase() : "all"
  );
  const [sortOption, setSortOption] = useState("relevant");
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  // Sync category state with URL parameter if it changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory.toLowerCase());
    } else {
      setSelectedCategory("all");
    }
  }, [urlCategory]);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Filter products
  const filteredProducts = products.filter((item) => {
    // Category match
    const categoryMatch =
      selectedCategory === "all" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    // Search match
    const searchMatch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "low-high") {
      return a.offerPrice - b.offerPrice;
    }
    if (sortOption === "high-low") {
      return b.offerPrice - a.offerPrice;
    }
    return 0; // default relevant
  });

  return (
    <div className="py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {selectedCategory === "all"
            ? "All Grocery Products"
            : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Showing {sortedProducts.length} fresh items available for instant delivery
        </p>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Items
          </button>
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat.path.toLowerCase())}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.path.toLowerCase()
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.text}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sort by:
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm bg-white text-gray-700 outline-none focus:border-primary cursor-pointer"
          >
            <option value="relevant">Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Search Tag if any */}
      {searchTerm && (
        <div className="mb-6 flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm w-fit">
          <span>Search results for: <strong>"{searchTerm}"</strong></span>
          <button
            onClick={() => {
              setSearchTerm("");
              setSearchParams({});
            }}
            className="text-gray-500 hover:text-red-500 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl mb-4">
            🛒
          </div>
          <h3 className="text-lg font-bold text-gray-800">No products found</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm">
            We couldn't find any products matching your filters. Try checking other categories or clearing your search.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchTerm("");
              setSearchParams({});
            }}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dull transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
