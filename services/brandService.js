const Brand = require('../models/brandModel');
const factory = require('./handlersFactory');

// @desc   Get list of brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(Brand);

// @desc   Get specefic brand by ID
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @desc   Create brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(Brand)
// @desc   Update specefic brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(Brand);

// @desc   Delete specefic brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(Brand);
