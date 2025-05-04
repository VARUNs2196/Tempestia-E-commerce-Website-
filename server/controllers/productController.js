
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getVendorProducts = async (req, res) => {
  console.log("getVendorAnalytics controller hit");
  try {
    const products = await Product.find({ vendor: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      vendor: req.user.id,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.id },
      { name, description, price, stock, category },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVendorAnalytics = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const totalSales = await Order.aggregate([
      { $match: { vendor: vendorId } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const topProducts = await Order.aggregate([
      { $match: { vendor: vendorId } },
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", count: { $sum: "$items.quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topCategories = await Product.aggregate([
      { $match: { vendor: vendorId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    const allVendorsSales = await Order.aggregate([
      { $group: { _id: "$vendor", total: { $sum: "$totalPrice" } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      topProducts,
      topCategories,
      allVendorsSales,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add this to your productController.js
exports.getVendorStore = async (req, res) => {
  try {
    // Fetch products by vendorId (using vendorId instead of storeName)
    const vendorProducts = await Product.find({ vendor: req.params.vendorId });

    if (!vendorProducts.length) {
      return res.status(404).json({ message: "No products found for this store." });
    }

    // Default to "Store" if no vendorStoreName is available
    const storeName = vendorProducts[0]?.vendorStoreName || "Store";

    res.json({
      storeName,
      products: vendorProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// In productController.js
exports.updateStoreName = async (req, res) => {
  try {
    const { storeName } = req.body;
    await Product.updateMany(
      { vendor: req.user.id },
      { $set: { vendorStoreName: storeName } }
    );
    res.json({ message: "Store name updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

