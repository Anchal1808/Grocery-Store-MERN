const express = require("express");
const {
  addToCart,
  updateCartItem,
  getUserCart,
} = require("../controllers/cartController");
const authUser = require("../middleware/auth");

const router = express.Router();

router.get("/get", authUser, getUserCart);
router.post("/add", authUser, addToCart);
router.post("/update", authUser, updateCartItem);

module.exports = router;
