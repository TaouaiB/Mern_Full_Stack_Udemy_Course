const express = require('express');

const {
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
} = require('../services/userService');

const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect);
// User
router.get('/getMe', getLoggedUserData, getUser);
router.put('/updateMyPassword', updateLoggedUserPassword);
router.put(
  '/updateMe',
  uploadUserImage,
  resizeImage,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.delete('/deleteMe', deleteLoggedUser);

//Admin
router.use(authService.allowedTo('admin', 'manager'));

router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
