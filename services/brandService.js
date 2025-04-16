const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');

const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Brand = require('../models/brandModel');

// Upload Single Image
exports.uploadBrandImage = uploadSingleImage('image');

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
	const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
	await sharp(req.file.buffer)
		.resize(600, 600)
		.toFormat('jpeg')
		.jpeg({ quality: 95 })
		.toFile(`uploads/brands/${filename}`);

	// Save image into DB
	req.body.image = filename;
	next();
});

// @desc   Get list of brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(Brand);

// @desc   Get specefic brand by ID
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @desc   Create brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(Brand);
// @desc   Update specefic brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(Brand);

// @desc   Delete specefic brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(Brand);
