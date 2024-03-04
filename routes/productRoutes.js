// routes\productRoutes.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Define routes
router.get('/', ProductController.getAllProducts);
router.post('/add', ProductController.addProduct);
router.get('/:productId', ProductController.getProductById); // Fetch a single product
router.put('/update/:productId', ProductController.updateProduct); // Update a product
router.delete('/delete/:productId', ProductController.deleteProduct); // Delete a product

module.exports = router;
