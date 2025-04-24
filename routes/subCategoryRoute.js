const express = require('express');

// mergeParams : allow access to parameters on other routers
// ex : we need to access categoryId from router
const router = express.Router({ mergeParams: true });

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require('../services/subCategoryService');
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
} = require('../utils/validators/subCategoryValidator');
const {
  deleteCategoryValidator,
} = require('../utils/validators/categoryValidator');

const authService = require('../services/authService');

// @desc   Create a new subcategory
router
  .route('/')
  .get(createFilterObject, getSubCategories)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
