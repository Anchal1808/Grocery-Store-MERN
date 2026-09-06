const express = require("express");
const {
  listProducts,
  getProductById,
  addProduct,
  seedProducts,
} = require("../controllers/productController");

const router = express.Router();

router.get("/list", listProducts);
router.get("/:id", getProductById);
router.post("/add", addProduct);
router.post("/seed", seedProducts);

module.exports = router;
