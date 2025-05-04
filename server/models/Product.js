// models/Product.js
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorStoreName: { type: String, default: "" }  // <-- Add this line
});
module.exports = mongoose.model('Product', productSchema);