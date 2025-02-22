const { check } = require('express-validator');
const validatorMiddleware = require('../../errorMiddleware/validatorMiddleware');

exports.getCategoryValidator = [
	check('id').isMongoId().withMessage('Invalid category ID format'),
	validatorMiddleware,
];

exports.createCategoryValidator = [
	check('name')
		.notEmpty()
		.withMessage('Category name is required')
		.isLength({ min: 2 })
		.withMessage('Too short Category name')
		.isLength({ max: 32 })
		.withMessage('Too long Category name'),
	validatorMiddleware,
];

exports.updateCategoryValidator = [
	check('id').isMongoId().withMessage('Invalid category ID format'),
	check('name')
		.notEmpty()
		.withMessage('Category name is required')
		.isLength({ min: 2 })
		.withMessage('Too short Category name')
		.isLength({ max: 32 })
		.withMessage('Too long Category name'),
	validatorMiddleware,
];

exports.deleteCategoryValidator = [
	check('id').isMongoId().withMessage('Invalid category ID format'),
	validatorMiddleware,
];
