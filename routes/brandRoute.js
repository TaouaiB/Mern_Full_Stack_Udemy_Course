const express = require('express');

const {
  getBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
  createBrandValidator,
} = require('../utils/validators/brandValidator');

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require('../services/brandService');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
