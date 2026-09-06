import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, setshowUserLogin, navigate, getCartCount, logout } = useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setOpen(false);
    }
  };

  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-3.5">
        {/* Logo */}
        <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
          <img className="h-8 md:h-9 object-contain" src={assets.logo} alt="Grocery Store" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "hover:text-primary transition"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "hover:text-primary transition"
            }
          >
            All Products
          </NavLink>
          <NavLink
            to="/#categories"
            className="hover:text-primary transition"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              setTimeout(() => {
                const el = document.getElementById("categories-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            Categories
          </NavLink>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 hover:border-primary px-3.5 py-1.5 rounded-full bg-gray-50 focus-within:bg-white focus-within:border-primary transition w-64 xl:w-72"
          >
            <input
              className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-800 text-xs sm:text-sm"
              type="text"
              placeholder="Search groceries, fruits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="cursor-pointer" aria-label="Search">
              <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-70 hover:opacity-100 transition" />
            </button>
          </form>

          {/* Cart Icon */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer p-1 hover:opacity-80 transition"
            title="Cart"
          >
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 h-6 object-contain" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 text-[11px] font-bold text-white bg-primary min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full shadow">
                {cartCount}
              </span>
            )}
          </div>

          {/* Auth Button / Profile Menu */}
          {!user ? (
            <button
              onClick={() => setshowUserLogin(true)}
              className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition text-white font-medium rounded-full text-sm shadow-sm"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer py-1">
                <img
                  src={assets.profile_icon}
                  className="w-8 h-8 rounded-full border border-gray-300"
                  alt="Profile"
                />
                <span className="text-sm font-medium text-gray-800 hidden md:inline max-w-28 truncate">
                  {user.name.split(" ")[0]}
                </span>
              </div>
              <ul className="hidden group-hover:block absolute top-full right-0 bg-white shadow-xl border border-gray-100 py-2 w-44 rounded-xl text-sm z-50 transition-all">
                <li className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                </li>
                <li
                  onClick={() => navigate("/my-orders")}
                  className="px-4 py-2.5 hover:bg-primary/10 hover:text-primary cursor-pointer flex items-center gap-2 transition"
                >
                  <img src={assets.order_icon} alt="" className="w-4 h-4 opacity-70" />
                  <span>My Orders</span>
                </li>
                <li
                  onClick={logout}
                  className="px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-red-500 cursor-pointer flex items-center gap-2 transition"
                >
                  <img src={assets.remove_icon} alt="" className="w-4 h-4 opacity-70" />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex sm:hidden items-center gap-4">
          <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 h-6 object-contain" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] font-bold text-white bg-primary w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
            className="p-1 text-gray-700"
          >
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="sm:hidden border-t border-gray-200 bg-white px-6 py-4 flex flex-col gap-3 shadow-lg">
          <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50">
            <input
              type="text"
              placeholder="Search groceries..."
              className="w-full bg-transparent text-sm outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-70" />
            </button>
          </form>

          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="py-1 text-gray-700 font-medium hover:text-primary"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className="py-1 text-gray-700 font-medium hover:text-primary"
          >
            All Products
          </NavLink>
          {user && (
            <NavLink
              to="/my-orders"
              onClick={() => setOpen(false)}
              className="py-1 text-gray-700 font-medium hover:text-primary"
            >
              My Orders
            </NavLink>
          )}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setshowUserLogin(true);
                }}
                className="w-full py-2 bg-primary hover:bg-primary-dull text-white rounded-full font-medium text-sm transition"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-gray-800 truncate">Hi, {user.name}</span>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="px-4 py-1.5 text-xs text-red-600 bg-red-50 rounded-full font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
