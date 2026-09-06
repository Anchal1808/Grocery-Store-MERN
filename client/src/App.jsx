import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

// Pages
import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <LoginModal />

      {/* Header */}
      {!isSellerPath && <Navbar />}

      {/* Main Content Area */}
      <main className={`flex-grow ${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<AllProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </main>

      {/* Footer */}
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
