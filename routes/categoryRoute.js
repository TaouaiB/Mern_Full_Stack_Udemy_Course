const express = require('express');
const router = express.Router();

const {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
} = require('../services/categoryService');

router.route('/').get(getCategories).post(createCategory);
router
	.route('/:id')
	.get(getCategory)
	.put(updateCategory)
	.delete(deleteCategory);

module.exports = router;
