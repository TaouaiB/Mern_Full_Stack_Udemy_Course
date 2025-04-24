const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');

const User = require('../models/userModel');

// @desc   Signup
// @route  GET /api/v1/auth/signup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  // 2- Create JSON WebToken
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc   Login
// @route  GET /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1- check if email and password are provided
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError('Please provide email and password', 400));
  }
  // 2- check if user exists with this email and password
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError('Invalid email or password', 401));
  }
  // 3- Create JSON WebToken
  const token = createToken(user._id);
  // 4- Send response
  res.status(200).json({ data: user, token });
});

// @desc   Make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1- Check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError('You are not logged in, please login to get access', 401)
    );
  }

  // 2- Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3- Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError('The user belonging to this token does no longer exist', 401)
    );
  }

  // 4- Check if user changed password after the token was issued
  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (changedTimestamp > decoded.iat) {
      return next(
        new ApiError('User recently changed password! Please log in again', 401)
      );
    }
  }
  req.user = currentUser;
  next();
});

// @desc   authorization (User Permissions)
exports.allowedTo =
  // user ... so i can get : ['admin', 'manager', 'user']
  (...roles) =>
    asyncHandler(async (req, res, next) => {
      // 1- access roles
      if (!roles.includes(req.user.role)) {
        return next(
          new ApiError(`You are not allowed to access this route`, 403)
        );
      }
      console.log(roles);
      next();
      // 2- access registered users (request.user.role)
    });

// @desc   Forget Password
// @route  Post /api/v1/auth/forgetPassword
// @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1- Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(
        `There is no user with this email address ${req.body.email}`,
        404
      )
    );
  }

  // 2- If user exists, generate hashed random 6 digits code and save it in the database
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save Hashed code to the database
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.passwordResetVerified = false;

  await user.save();

  // 3- Send the reset code to user's email
  const message = `Your password reset code is ${resetCode}. It is valid for 10 minutes. If you did not request this, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 minutes)',
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ApiError('There was an error sending the email', 500));
  }
  // 4- Send response
  res.status(200).json({
    status: 'success',
    message: 'Reset code sent to your email',
  });
});

// @desc   Verify Reset Code
// @route  Post /api/v1/auth/verifyResetCode
// @access Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1- Get user by reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('Invalid or expired reset code', 400));
  }
  // 2- If user exists, update passwordResetVerified to true
  user.passwordResetVerified = true;
  await user.save();
  // 3- Send response
  res.status(200).json({
    status: 'success',
    message: 'Reset code verified successfully',
  });
});

// @desc   Reset Password
// @route  Post /api/v1/auth/resetPassword
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('No user found with this email', 404));
  }
  // 1- Check if passwordResetVerified is true
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code is not verified', 400));
  }
  // 2- Update password and remove reset code and expiration time
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  // 3- Create JSON WebToken
  const token = createToken(user._id);
  // 4- Send response
  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully',
  });
});
