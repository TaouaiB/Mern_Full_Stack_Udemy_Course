const express = require('express');

const {
  signupValidator,
  loginValidator,
} = require('../utils/validators/authValidator');

const {
  signup,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} = require('../services/authService');

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgetPassword', forgetPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);

//router
//.route('/:id')
//.get(getUserValidator, getUser)
//.put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//.delete(deleteUserValidator, deleteUser);

module.exports = router;
