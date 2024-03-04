// controllers/productController.js
const Product = require('../models/product');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async addProduct(req, res) {
    const { name, costPrice, sellingPrice, inventory } = req.body;

    console.log('Received data:', { name, costPrice, sellingPrice, inventory });

    try {
      if (!name || !costPrice || !sellingPrice || !inventory) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
      }

      // Check if a product with the same name already exists
      const existingProduct = await Product.findOne({
        where: {
          name: name,
        },
      });

      if (existingProduct) {
        return res.status(400).json({ success: false, error: 'Product with the same name already exists' });
      }

      // If product with the same name doesn't exist, create a new one
      const result = await Product.create({
        name,
        cost_price: costPrice,
        selling_price: sellingPrice,
        inventory,
      });

      console.log('Product added to the database:', result);

      res.json({ success: true, product: result });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }


  static async getProductById(req, res) {
    try {
      const product = await Product.findByPk(req.params.productId);

      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
      } else {
        res.json({ success: true, product });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  static async updateProduct(req, res) {
    const { name, costPrice, sellingPrice, inventory } = req.body;

    try {

      const updatedProduct = await Product.update(
        {
          name,
          cost_price: costPrice,
          selling_price: sellingPrice,
          inventory,
        },
        {
          where: {
            id: req.params.productId,
          },
        }
      );

      if (updatedProduct[0] === 0) {
        res.status(404).json({ success: false, error: 'Product not found' });
      } else {
        res.json({ success: true });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const deletedProductCount = await Product.destroy({
        where: {
          id: req.params.productId,
        },
      });

      if (deletedProductCount === 0) {
        res.status(404).json({ success: false, error: 'Product not found' });
      } else {
        res.json({ success: true });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}

module.exports = ProductController;
