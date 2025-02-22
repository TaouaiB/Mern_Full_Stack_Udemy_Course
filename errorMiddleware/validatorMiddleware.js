const { validationResult } = require('express-validator');

// @desc Find the validation errors in this request and wrap them in an object with handy functions
const validatorMiddleware = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// If all good it will continue to next MW , which is the handler
	next();
};

module.exports = validatorMiddleware;
