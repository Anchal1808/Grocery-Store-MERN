const Order = require("../models/Order");
const User = require("../models/User");

// Place Order (COD or Online)
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    if (!address || !address.street || !address.city || !address.phone) {
      return res.status(400).json({ success: false, message: "Complete address is required" });
    }

    const orderData = {
      userId: req.userId,
      items,
      amount,
      address,
      paymentType: paymentType || "COD",
      isPaid: paymentType === "Online" ? true : false,
      status: "Order Placed",
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Clear user cart upon successful order
    await User.findByIdAndUpdate(req.userId, { cartData: {} });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Orders for Logged-in User
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Orders (Admin/Seller)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "orderId and status are required" });
    }

    const updated = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    return res.json({ success: true, message: "Order status updated", order: updated });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
