const { check } = require('express-validator');
const validatorMiddleware = require('../../errorMiddleware/validatorMiddleware');

exports.getSubCategoryValidator = [
	check('id').isMongoId().withMessage('Invalid Subcategory ID format'),
	validatorMiddleware,
];

exports.createSubCategoryValidator = [
	check('name')
		.notEmpty()
		.withMessage('SubCategory name is required')
		.isLength({ min: 2 })
		.withMessage('Too short SubCategory name')
		.isLength({ max: 32 })
		.withMessage('Too long SubCategory name'),
	check('category')
		.notEmpty()
		.withMessage('SubCategory must be long to a Category')
		.isMongoId()
		.withMessage('Invalid SubCategory id Format'),
	validatorMiddleware,
];

exports.updateSubCategoryValidator = [
	check('id').isMongoId().withMessage('Invalid Subcategory ID format'),
	check('name')
		.notEmpty()
		.withMessage('SubCategory name is required')
		.isLength({ min: 2 })
		.withMessage('Too short SubCategory name')
		.isLength({ max: 32 })
		.withMessage('Too long SubCategory name'),
	validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
	check('id').isMongoId().withMessage('Invalid Subcategory ID format'),
	validatorMiddleware,
];
