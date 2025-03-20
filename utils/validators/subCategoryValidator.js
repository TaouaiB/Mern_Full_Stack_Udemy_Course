const { check, body } = require('express-validator');
const validatorMiddleware = require('../../errorMiddleware/validatorMiddleware');
const Category = require('../../models/categoryModel');
const slugify = require('slugify');

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
		.withMessage('Too long SubCategory name')
		.custom((val, { req }) => {
			req.body.slug = slugify(val);
			return true;
		}),
	check('category')
		.notEmpty()
		.withMessage('SubCategory must be long to a Category')
		.isMongoId()
		.withMessage('Invalid SubCategory id Format')
		.custom((categoryId) =>
			Category.findById(categoryId).then((category) => {
				if (!category)
					return Promise.reject(
						new Error(`No category found for this id: ${categoryId}`)
					);
			})
		),

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
	body('name').custom((val, { req }) => {
		req.body.slug = slugify(val);
		return true;
	}),
	validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
	check('id').isMongoId().withMessage('Invalid Subcategory ID format'),
	validatorMiddleware,
];
