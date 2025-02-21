const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, category, stockQuantity, images } = req.body;
    if (!name || !price || stockQuantity === undefined) {
      return res
        .status(400)
        .json({ error: 'Name, price, and stock quantity are required' });
    }
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      stockQuantity,
      images
    });
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, stockQuantity, images } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: 'Product not found' });

    // Update fields if provided
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.stockQuantity =
      stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
    product.images = images || product.images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
