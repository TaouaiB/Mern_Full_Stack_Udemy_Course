const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./errorMiddleware/errorMiddleware');
const dbConnection = require('./config/database');

// Routes
const categoryRoute = require('./routes/categoryRoute');
const subCategoriesRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');

// Connect with db
dbConnection();

// exporess app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.Node_ENV === 'development') {
	app.use(morgan('dev'));
	console.log(`mode: ${process.env.Node_ENV}`);
}

// Mount Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoriesRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);

app.all('*', (req, res, next) => {
	next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
	console.log(`App running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
	console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
	// it will close the server , then close anything inside like process ( application )
	server.close(() => {
		console.error(`Shutting down ...`);
		process.exit(1);
	});
});
