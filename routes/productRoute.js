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

const router = express.Router();

router
	.route('/')
	.get(getProducts)
	.post(
		uploadProductImages,
		resizeProductImages,
		createProductValidator,
		createProduct
	);
router
	.route('/:id')
	.get(getProductValidator, getProduct)
	.put(
		uploadProductImages,
		resizeProductImages,
		updateProductValidator,
		updateProduct
	)
	.delete(deleteProductValidator, deleteProduct);
module.exports = router;
