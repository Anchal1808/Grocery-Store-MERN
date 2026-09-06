import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const backendUrl = "http://localhost:5000";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setshowUserLogin] = useState(false);
  const [products, setProducts] = useState(dummyProducts);
  const [cartItems, setcartItems] = useState({});
  const deliveryFee = 2;

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success && response.data.products && response.data.products.length > 0) {
        // Map backend products with client assets if image is placeholder or match with dummy
        setProducts(response.data.products);
      } else {
        // If DB is empty, use dummyProducts and optionally seed
        setProducts(dummyProducts);
      }
    } catch (error) {
      console.warn("Backend not reachable or error fetching products, using dummy data:", error.message);
      setProducts(dummyProducts);
    }
  };

  // Fetch User Profile
  const fetchUserProfile = async (userToken) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/me`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setUser(response.data.user);
        if (response.data.user.cartData) {
          setcartItems(response.data.user.cartData);
        }
      }
    } catch (error) {
      console.error("Fetch profile failed:", error.message);
      // If token expired, clear it
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };

  // Add product to cart
  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setcartItems(cartData);
    toast.success("Added to Cart");

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Failed to sync cart with server:", error.message);
      }
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = Number(quantity);
    }
    setcartItems(cartData);
    toast.success("Cart Updated");

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Failed to sync cart with server:", error.message);
      }
    }
  };

  // Remove product from cart
  const removeFromCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }
    }
    setcartItems(cartData);
    toast.success("Removed from Cart");

    if (token) {
      try {
        const qty = cartData[itemId] || 0;
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, quantity: qty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Failed to sync cart with server:", error.message);
      }
    }
  };

  // Compute total quantity of items in cart
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalCount += cartItems[itemId];
      }
    }
    return totalCount;
  };

  // Compute total price of items in cart
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((p) => String(p._id) === String(itemId));
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setcartItems({});
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Seed backend with dummyProducts if backend has 0 products
  const seedProductsToBackend = async () => {
    try {
      await axios.post(`${backendUrl}/api/product/seed`, { products: dummyProducts });
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchProducts();
    if (token) {
      fetchUserProfile(token);
    }
  }, [token]);

  const value = {
    navigate,
    user,
    setUser,
    token,
    setToken,
    isSeller,
    setIsSeller,
    showUserLogin,
    setshowUserLogin,
    products,
    setProducts,
    currency,
    backendUrl,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    setcartItems,
    getCartCount,
    getCartAmount,
    deliveryFee,
    logout,
    fetchProducts,
    seedProductsToBackend,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
