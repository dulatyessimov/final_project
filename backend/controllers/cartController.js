// controllers/orderController.js
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product'); // Make sure a Product model exists

// Get all orders (for administrative purposes)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username')
      .populate('products.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username')
      .populate('products.product', 'name price');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new order (if needed for direct creation)
exports.addOrder = async (req, res) => {
  try {
    const { products, totalCost } = req.body;
    const user = req.user?._id;

    if (!products || products.length === 0 || !totalCost) {
      return res.status(400).json({ error: 'Products and total cost are required' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    const newOrder = new Order({ user, products, totalCost });
    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add product to shopping cart (pending order)
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user?._id;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    // Get product details (to calculate price)
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Find existing pending order (cart) for the user
    let order = await Order.findOne({ user, orderStatus: 'Pending' });
    if (order) {
      // Check if the product is already in the cart
      const productIndex = order.products.findIndex(item => item.product.toString() === productId);
      if (productIndex > -1) {
        // Increase the quantity
        order.products[productIndex].quantity += quantity;
      } else {
        // Add the new product
        order.products.push({ product: productId, quantity });
      }
      // Update total cost
      order.totalCost += product.price * quantity;
    } else {
      // Create a new cart (pending order)
      order = new Order({
        user,
        products: [{ product: productId, quantity }],
        totalCost: product.price * quantity
      });
    }

    const savedOrder = await order.save();
    res.json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the current shopping cart (pending order) for the user
exports.getCart = async (req, res) => {
  try {
    // Since req.user is already defined and contains a valid _id, use it directly:
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }
    
    // Optionally, if you want to check validity, convert it to string for isValid:
    if (!mongoose.Types.ObjectId.isValid(req.user._id.toString())) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Use the _id directly (it's already an ObjectId)
    const userId = req.user._id;
    const cart = await Order.findOne({ user: userId, orderStatus: 'Pending' })
      .populate('products.product', 'name price');
    
    if (!cart) {
      return res.json({ message: 'No items in cart', products: [], totalCost: 0 });
    }
    res.json(cart);
  } catch (error) {
    console.error('Detailed error in getCart:', error);
    res.status(500).json({ error: error.message });
  }
};



// Update the shopping cart (if you want to allow direct modifications)
exports.updateCart = async (req, res) => {
  try {
    const user = req.user?._id;
    const { products, totalCost } = req.body;
    if (!user) return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    
    let cart = await Order.findOne({ user, orderStatus: 'Pending' });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    
    cart.products = products;
    cart.totalCost = totalCost;
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Checkout: simulate payment processing and update order status
exports.checkoutCart = async (req, res) => {
  try {
    const user = req.user?._id;
    if (!user) return res.status(401).json({ error: 'Unauthorized: User not logged in' });

    let cart = await Order.findOne({ user, orderStatus: 'Pending' });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    // Simulate payment processing here...
    cart.orderStatus = 'Processing'; // or 'Completed' based on your logic
    const updatedOrder = await cart.save();
    res.json({ message: 'Checkout successful', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// In controllers/orderController.js
exports.deleteCartItem = async (req, res) => {
  try {
    const user = req.user?._id;
    const { productId } = req.params;  // Expect productId in URL params

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }
    
    // Find the user's pending cart
    const cart = await Order.findOne({ user, orderStatus: 'Pending' });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    
    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }
    
    // Optionally, update the total cost by subtracting the removed item's cost.
    // Assume product price is available either via population or by fetching from the Product model.
    let removedItem = cart.products[productIndex];
    
    // If the product is not populated, fetch it:
    if (!removedItem.product.name) {
      const prod = await Product.findById(productId);
      if (prod) {
        removedItem = { ...removedItem._doc, product: prod };
      }
    }
    
    const price = removedItem.product.price;
    const quantity = removedItem.quantity;
    cart.totalCost -= price * quantity;
    if (cart.totalCost < 0) cart.totalCost = 0;
    
    // Remove the product from the products array
    cart.products.splice(productIndex, 1);
    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: error.message });
  }
};






// // Update an order (for other administrative changes)
// exports.updateOrder = async (req, res) => {
//   try {
//     const { orderStatus } = req.body;
//     const order = await Order.findById(req.params.id);
//     if (!order)
//       return res.status(404).json({ error: 'Order not found' });

//     order.orderStatus = orderStatus || order.orderStatus;
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete an order by ID
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order)
//       return res.status(404).json({ error: 'Order not found' });
//     await order.deleteOne();
//     res.json({ message: 'Order deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
