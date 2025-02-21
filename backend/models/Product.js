const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    stockQuantity: { type: Number, required: true },
    images: [String] // Array of image URLs
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
