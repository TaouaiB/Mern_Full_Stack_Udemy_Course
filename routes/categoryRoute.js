const express = require('express');

const {
	getCategoryValidator,
	deleteCategoryValidator,
	updateCategoryValidator,
	createCategoryValidator,
} = require('../utils/validators/categoryValidator');

const {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	uploadCategoryImage,
	resizeImage,
} = require('../services/categoryService');

const subCategoriesRoute = require('./subCategoryRoute');

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoriesRoute);

router
	.route('/')
	.get(getCategories)
	.post(
		uploadCategoryImage,
		resizeImage,
		createCategoryValidator,
		createCategory
	);
router
	.route('/:id')
	.get(getCategoryValidator, getCategory)
	.put(
		uploadCategoryImage,
		resizeImage,
		updateCategoryValidator,
		updateCategory
	)
	.delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
