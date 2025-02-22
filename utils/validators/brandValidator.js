const { check } = require('express-validator');
const validatorMiddleware = require('../../errorMiddleware/validatorMiddleware');

exports.getBrandValidator = [
	check('id').isMongoId().withMessage('Invalid Brand ID format'),
	validatorMiddleware,
];

exports.createBrandValidator = [
	check('name')
		.notEmpty()
		.withMessage('Brand name is required')
		.isLength({ min: 2 })
		.withMessage('Too short Brand name')
		.isLength({ max: 32 })
		.withMessage('Too long Brand name'),
	validatorMiddleware,
];

exports.updateBrandValidator = [
	check('id').isMongoId().withMessage('Invalid Brand ID format'),
	check('name')
		.notEmpty()
		.withMessage('Brand name is required')
		.isLength({ min: 2 })
		.withMessage('Too short Brand name')
		.isLength({ max: 32 })
		.withMessage('Too long Brand name'),
	validatorMiddleware,
];

exports.deleteBrandValidator = [
	check('id').isMongoId().withMessage('Invalid Brand ID format'),
	validatorMiddleware,
];
