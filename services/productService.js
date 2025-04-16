const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const factory = require('./handlersFactory');
const Product = require('../models/productModel');

exports.uploadProductImages = uploadMixOfImages([
	{
		name: 'imageCover',
		maxCount: 1,
	},
	{
		name: 'images',
		maxCount: 5,
	},
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
	// 1- Image processing for image cover
	if (req.files.imageCover) {
		const imageCoverfilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
		await sharp(req.files.imageCover[0].buffer)
			.resize(2000, 1333)
			.toFormat('jpeg')
			.jpeg({ quality: 95 })
			.toFile(`uploads/products/${imageCoverfilename}`);

		// Save image into DB
		req.body.imageCover = imageCoverfilename;
	}

	// 2- Image processing for images
	if (req.files.images) {
		req.body.images = [];
		await Promise.all(
			req.files.images.map(async (image, index) => {
				const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
				await sharp(image.buffer)
					.resize(2000, 1333)
					.toFormat('jpeg')
					.jpeg({ quality: 95 })
					.toFile(`uploads/products/${imageName}`);

				// Save image into DB
				req.body.images.push(imageName);
			})
		);
		next();
	}
});

// @desc   Get list of products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product, 'Products');

// @desc   Get specefic product by ID
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(Product);

// @desc   Create product
// @route  POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(Product);

// @desc   Update specefic product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete specefic product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(Product);
