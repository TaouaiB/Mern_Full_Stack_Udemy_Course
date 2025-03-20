const factory = require('./handlersFactory');
const Product = require('../models/productModel');

// @desc   Get list of products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc   Get specefic product by ID
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(Product);

// @desc   Create product
// @route  POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(Product);

// @desc   Update specefic product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete specefic product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(Product);