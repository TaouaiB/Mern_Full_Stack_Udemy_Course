const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const SubCategory = require('../models/subCategoryModel');
const ApiError = require('../utils/apiError');

exports.setCategoryIdToBody = (req, res, next) => {
	// Nested Route
	if (!req.body.category) req.body.category = req.params.categoryId;
	next();
};
// @desc   Create subCategory
// @route  POST /api/v1/subCategories
// @access Private
exports.createSubCategory = asyncHandler(async (req, res) => {
	const { name, category } = req.body;
	const subCategory = await SubCategory.create({
		name,
		slug: slugify(name),
		category,
	});
	res.status(201).json({ data: subCategory });
});

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
exports.getSubCategories = asyncHandler(async (req, res) => {
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 5;
	const skip = (page - 1) * limit;

	const subCategories = await SubCategory.find(req.filterObj)
		.skip(skip)
		.limit(limit)
		.populate({
			path: 'category',
			select: 'name -_id',
		});
	res
		.status(200)
		.json({ results: subCategories.length, page, data: subCategories });
});

// @desc   Get specefic subcategory by ID
// @route  GET /api/v1/subcategories/:id
// @access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const subCategory = await SubCategory.findById(id).populate({
		path: 'category',
		select: 'name -_id',
	});
	if (!subCategory) {
		return next(new ApiError(`No subCategory for this id ${id}`, 404));
	}
	res.status(200).json({ data: subCategory });
});

// @desc   Update specefic subcategory
// @route  PUT /api/v1/subcategory/:id
// @access Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { name, category } = req.body;

	const updateSubCategory = await SubCategory.findOneAndUpdate(
		{ _id: id },
		{ name: name, slug: slugify(name), category },
		{ new: true }
	).populate({
		path: 'category',
		select: 'name -_id',
	});

	if (!updateSubCategory) {
		return next(new ApiError(`No subcategory for this id ${id}`, 404));
	}
	res.status(200).json({ data: updateSubCategory });
});

// @desc   Delete specefic subcategory
// @route  DELETE /api/v1/subcategory/:id
// @access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const subCategory = await SubCategory.findByIdAndDelete(id);

	if (!subCategory) {
		return next(new ApiError(`No subcategory for this id ${id}`, 404));
	}
	res.status(204).send();
});
