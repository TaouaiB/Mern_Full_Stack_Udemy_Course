const express = require('express');

// mergeParams : allow access to parameters on other routers
// ex : we need to access categoryId from router
const router = express.Router({ mergeParams: true });

const {
	createSubCategory,
	getSubCategories,
	getSubCategory,
	updateSubCategory,
	deleteSubCategory,
	setCategoryIdToBody,
	createFilterObject,
} = require('../services/subCategoryService');
const {
	createSubCategoryValidator,
	getSubCategoryValidator,
	updateSubCategoryValidator,
} = require('../utils/validators/subCategoryValidator');
const {
	deleteCategoryValidator,
} = require('../utils/validators/categoryValidator');

// @desc   Create a new subcategory
router
	.route('/')
	.get(createFilterObject, getSubCategories)
	.post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory);

router
	.route('/:id')
	.get(getSubCategoryValidator, getSubCategory)
	.put(updateSubCategoryValidator, updateSubCategory)
	.delete(deleteCategoryValidator, deleteSubCategory);

module.exports = router;
