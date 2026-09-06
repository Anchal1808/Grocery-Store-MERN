const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: Array,
      required: true,
      default: [],
    },
    amount: {
      type: Number,
      required: true,
    },
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipcode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      default: "Order Placed",
      enum: [
        "Order Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
    },
    paymentType: {
      type: String,
      default: "COD",
      enum: ["COD", "Online"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
