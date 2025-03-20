const Category = require('../models/categoryModel');
const factory = require('./handlersFactory');

// @desc   Get list of categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(Category);


// @desc   Get specefic categor by ID
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(Category);

// @desc   Create category
// @route  POST /api/v1/categories
// @access Private
exports.createCategory = factory.createOne(Category);

// @desc   Update specefic category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = factory.updateOne(Category);

// @desc   Delete specefic category
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(Category);
