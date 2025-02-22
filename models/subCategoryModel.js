const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			unique: [true, 'SubCategory must be unique'],
			minlength: [1, 'Too Short SubCategory name'],
			maxlength: [32, 'Too long SubCategory name'],
		},
		slug: {
			type: String,
			lowercase: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: [true, 'SubCategory must be belong to a parent Category'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);
