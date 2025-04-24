const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');

const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');
const createToken = require('../utils/createToken');

// Upload Single Image
exports.uploadUserImage = uploadSingleImage('profileImage');

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into DB
    req.body.profileImage = filename;
  }
  next();
});

// @desc   Get list of users
// @route  GET /api/v1/users
// @access Private
exports.getUsers = factory.getAll(User);

// @desc   Get specific user by ID
// @route  GET /api/v1/users/:id
// @access Private
exports.getUser = factory.getOne(User);

// @desc   Create user
// @route  POST /api/v1/users
// @access Private
exports.createUser = factory.createOne(User);
// @desc   Update specific user
// @route  PUT /api/v1/users/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No User for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No User for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc   Delete specific user
// @route  DELETE /api/v1/users/:id
// @access Private
exports.deleteUser = factory.deleteOne(User);

// @desc   Get Logged User Data
// @route  GET /api/v1/users/getMe
// @access Private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id; // to use the same getUser function
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user Data ( without password or role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user account
// @route   PUT /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: 'success' });
});
