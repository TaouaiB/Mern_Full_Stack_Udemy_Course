const { check, body } = require('express-validator');
const slugify = require('slugify');
const { ValidatorsImpl } = require('express-validator/lib/chain');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');

exports.createProductValidator = [
	check('title')
		.notEmpty()
		.withMessage('Product title is required')
		.isLength({ min: 3 })
		.withMessage('Too short Product title')
		.isLength({ max: 64 })
		.withMessage('Too long Product title')
		.custom((val, { req }) => {
			req.body.slug = slugify(val);
			return true;
		}),

	check('description')
		.notEmpty()
		.withMessage('Product description is required')
		.isLength({ min: 10 })
		.withMessage('Too short Product description')
		.isLength({ max: 2000 })
		.withMessage('Too long Product description'),
	check('quantity')
		.notEmpty()
		.isNumeric()
		.withMessage('Product quantity must be a number'),
	check('sold')
		.optional()
		.isNumeric()
		.withMessage('Product sold must be a number'),
	check('price')
		.notEmpty()
		.withMessage('Product price is required')
		.isNumeric()
		.withMessage('Product price must be a number')
		.isLength({ max: 32 })
		.withMessage('Too long Product price'),
	check('priceAfterDiscount')
		.optional()
		.isNumeric()
		.withMessage('Product price after discount must be a number')
		.toFloat()
		.custom((value, { req }) => {
			if (req.body.price <= value) {
				throw new Error('Price after discount must be lower than price');
			}
			return true;
		}),
	check('colors')
		.optional()
		.isArray()
		.withMessage('Product colors must be an array'),
	check('imageCover').notEmpty().withMessage('Product imageCover is required'),
	check('images')
		.optional()
		.isArray()
		.withMessage('Product images must be an array'),
	check('category')
		.notEmpty()
		.withMessage('Product must belong to a category')
		.isMongoId()
		.withMessage('Invalid ID format')
		.custom((categoryId) =>
			Category.findById(categoryId).then((category) => {
				if (!category) {
					return Promise.reject(
						new Error(`No category found for this id: ${categoryId}`)
					);
				}
			})
		),
	check('subcategories')
		.optional()
		.isMongoId()
		.withMessage('Invalid ID format')
		.custom((subCategoriesIds) =>
			SubCategory.find({ _id: { $exists: true, $in: subCategoriesIds } }).then(
				(res) => {
					// Length result = length subcategories in body
					if (res.length < 1 || res.length !== subCategoriesIds.length) {
						return Promise.reject(new Error('Invalid SubCategory ID'));
					}
				}
			)
		)
		.custom((val, { req }) =>
			SubCategory.find({ category: req.body.category }).then(
				(Subcategories) => {
					const subCategoriesIdInDB = [];
					Subcategories.forEach((subCategory) => {
						subCategoriesIdInDB.push(subCategory._id.toString());
					});
					// Check if subcategories ids in db incluude subcategories in req.body (true/false)
					const checker = (target, arr) => target.every((v) => arr.includes(v));
					if (!checker(val, subCategoriesIdInDB)) {
						return Promise.reject(
							new Error('Subcategories not belong to category')
						);
					}
				}
			)
		)
		.custom((subCategoriesIds) => {
			const seen = new Set(); // Create an empty Set to track unique IDs

			// Check for duplicates
			const hasDuplicates = subCategoriesIds.some((id) => {
				if (seen.has(id)) return true; // If the ID is already in the Set, it's a duplicate
				seen.add(id); // Otherwise, add the ID to the Set
				return false; // Continue checking the next ID
			});

			if (hasDuplicates) {
				return Promise.reject(new Error('Duplicate SubCategory ID found'));
			}

			return true; // Validation passes if no duplicates
		}),

	check('brand').optional().isMongoId().withMessage('Invalid ID format'),
	check('ratingAverage')
		.optional()
		.isNumeric()
		.withMessage('ratingAverage must be a number')
		.isLength({ min: 1 })
		.withMessage('Rating must be above or equal 1.0')
		.isLength({ max: 5 })
		.withMessage('Rating must be below or equal to 5.0'),
	check('ratingQuantity')
		.optional()
		.isNumeric()
		.withMessage('ratingQuantity must be a number'),

	validatorMiddleware,
];

exports.updateProductValidator = [
	check('id').isMongoId().withMessage('Invalid ID formate'),
	body('title')
		.optional()
		.custom((val, { req }) => {
			req.body.slug = slugify(val);
			return true;
		}),
	body('title')
		.optional()
		.custom((val, { req }) => {
			req.body.slug = slugify(val);
			return true;
		}),
	validatorMiddleware,
];

exports.getProductValidator = [
	check('id').isMongoId().withMessage('Invalid Product ID format'),
	validatorMiddleware,
];

exports.deleteProductValidator = [
	check('id').isMongoId().withMessage('Invalid Product ID format'),
	validatorMiddleware,
];
