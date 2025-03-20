const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
			minlength: [3, 'Title must be at least 3 characters long'],
			maxlength: [100, 'Title must be no more than 100 characters long'],
		},
		slug: {
			type: String,
			required: true,
			lowercase: true,
		},
		description: {
			type: String,
			required: [true, ' Product description is required'],
			minlength: [
				20,
				'Product Description must be at least 20 characters long',
			],
			maxlength: [
				500,
				'Product Description must be no more than 500 characters long',
			],
		},
		quantity: {
			type: Number,
			required: [true, 'Product quantity is required'],
			min: [1, 'Product quantity must be at least 1'],
		},
		sold: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, 'Product price is required'],
			trim: true,
			min: [0, 'Product price must be at least $0'],
			max: [200000, 'Too long product price'],
		},
		priceAfterDiscount: {
			type: Number,
		},
		colors: {
			type: [String],
		},
		imageCover: {
			type: String,
			required: [true, 'Product image cover is required'],
		},
		images: [String],
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: [true, 'Product must belong to a Category'],
		},
		subcategories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'SubCategory',
			},
		],
		brand: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Brand',
		},
		ratingsAverage: {
			type: Number,
			min: [1, 'Rating must be above or equal to 1'],
			max: [5, 'Rating must be below or equal to 5'],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
	},
	{ timeseries: true }
);

// Mongoose query Middleware
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name -_id',
    });
    next();
});
module.exports = mongoose.model('Product', productSchema);
