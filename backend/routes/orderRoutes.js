const express = require("express");
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const authUser = require("../middleware/auth");

const router = express.Router();

router.post("/place", authUser, placeOrder);
router.get("/user-orders", authUser, getUserOrders);
router.get("/list", getAllOrders);
router.post("/status", updateOrderStatus);

module.exports = router;
