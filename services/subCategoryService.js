const SubCategory = require('../models/subCategoryModel');
const factory = require('./handlersFactory');

exports.setCategoryIdToBody = (req, res, next) => {
	// Nested Route ( create ) 
	if (!req.body.category) req.body.category = req.params.categoryId;
	next();
};

// Nested Route
// @route GET api/v1/categories/:categoryId/subcategories
exports.createFilterObject = (req, res, next) => {
	let filterObject = {};
	if (req.params.categoryId) filterObject = { category: req.params.categoryId };
	req.filterObj = filterObject;
	next();
};

// @desc   Get list of subCategories
// @route  GET /api/v1/subCategories
// @access Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc   Get specefic subcategory by ID
// @route  GET /api/v1/subcategories/:id
// @access Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc   Create subCategory
// @route  POST /api/v1/subCategories
// @access Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc   Update specefic subcategory
// @route  PUT /api/v1/subcategory/:id
// @access Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc   Delete specefic subcategory
// @route  DELETE /api/v1/subcategory/:id
// @access Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
