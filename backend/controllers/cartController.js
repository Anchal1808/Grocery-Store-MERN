const User = require("../models/User");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ success: false, message: "itemId is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    await User.findByIdAndUpdate(req.userId, { cartData });
    return res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    if (!itemId || quantity === undefined) {
      return res.status(400).json({ success: false, message: "itemId and quantity are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = Number(quantity);
    }

    await User.findByIdAndUpdate(req.userId, { cartData });
    return res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.error("Update cart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's cart data
const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  updateCartItem,
  getUserCart,
};
