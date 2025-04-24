const express = require('express');

const {
  getProductValidator,
  deleteProductValidator,
  updateProductValidator,
  createProductValidator,
} = require('../utils/validators/productValidator');

const {
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProduct,
  uploadProductImages,
  resizeProductImages,
} = require('../services/productService');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
