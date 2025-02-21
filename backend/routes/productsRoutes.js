const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const protectRoute = require('../middleware/protectRoute');  // Assuming you have a mi

// Get all products
router.get('/', getAllProducts);



// Get a product by ID
router.get('/:id', getProductById);

// Update a product by ID
router.put('/edit/:id', updateProduct);

// Delete a product by ID
router.delete('/delete/:id', deleteProduct);

router.post('/add', protectRoute, addProduct); // Protect the route

module.exports = router;



