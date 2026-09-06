const Product = require("../models/Product");

// Get all products
const listProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (error) {
    console.error("List Products Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, product });
  } catch (error) {
    console.error("Get Product Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, category, price, offerPrice, image, description, inStock } = req.body;

    if (!name || !category || price === undefined || offerPrice === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newProduct = new Product({
      name,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image: Array.isArray(image) ? image : [image],
      description: Array.isArray(description) ? description : [description],
      inStock: inStock !== undefined ? inStock : true,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json({ success: true, message: "Product added", product: savedProduct });
  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Seed products from client assets
const seedProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide an array of products to seed." });
    }

    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0 && !req.query.force) {
      const existing = await Product.find({});
      return res.json({
        success: true,
        message: `Database already contains ${count} products.`,
        products: existing,
      });
    }

    if (req.query.force) {
      await Product.deleteMany({});
    }

    // Format items without keeping client mock _id so MongoDB generates valid ObjectIds
    const itemsToInsert = products.map((item) => ({
      name: item.name,
      category: item.category,
      price: item.price,
      offerPrice: item.offerPrice,
      image: item.image || [],
      description: item.description || [],
      inStock: item.inStock !== undefined ? item.inStock : true,
    }));

    const inserted = await Product.insertMany(itemsToInsert);
    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} products to MongoDB!`,
      products: inserted,
    });
  } catch (error) {
    console.error("Seed Products Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  listProducts,
  getProductById,
  addProduct,
  seedProducts,
};
