const { check, body } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

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
		.withMessage('Too long Category name')
		.custom((val, { req }) => {
			req.body.slug = slugify(val);
			return true;
		}),
	validatorMiddleware,
];

exports.updateCategoryValidator = [
	check('id').isMongoId().withMessage('Invalid category ID format'),
	check('name')
		.optional()
		.isLength({ min: 2 })
		.withMessage('Too short Category name')
		.isLength({ max: 32 })
		.withMessage('Too long Category name'),
	body('name')
		.optional()
		.custom((val, { req }) => {
			req.body.slug = slugify(val);
			return true;
		}),
	validatorMiddleware,
];

exports.deleteCategoryValidator = [
	check('id').isMongoId().withMessage('Invalid category ID format'),
	validatorMiddleware,
];
