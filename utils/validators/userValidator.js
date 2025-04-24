const { check, body } = require('express-validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('Email is Required')
    .isEmail()
    .withMessage('Invalid Email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already exist'));
        }
      })
    ),

  check('password')
    .notEmpty()
    .withMessage('Passowrd is Required')
    .isLength({ min: 6 })
    .withMessage('Min Password Lenght Should be 6 ')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirmation) {
        throw new Error('Password Confirmation Incorrect');
      }
      return true;
    }),

  check('passwordConfirmation')
    .notEmpty()
    .withMessage('Password confirmation is Required'),

  check('phone')
    .optional()
    .isMobilePhone(['ar-TN', 'ar-SA'])
    .withMessage(
      'Invalid Phone Number: Only accept Tunisian / Saudi Phone numbers'
    ),

  check('profileImage').optional(),

  check('role').optional(),

  validatorMiddleware,
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User ID format'),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User ID format'),

  check('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Too short User name')
    .isLength({ max: 32 })
    .withMessage('Too long User name'),

  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid Email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already exist'));
        }
      })
    ),

  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Min Password Lenght Should be 6 '),

  check('phone')
    .optional()
    .isMobilePhone(['ar-TN', 'ar-SA'])
    .withMessage(
      'Invalid Phone Number: Only accept Tunisian / Saudi Phone numbers'
    ),

  check('profileImage').optional(),

  check('role').optional(),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User ID format'),
  check('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  check('passwordConfirmation')
    .notEmpty()
    .withMessage('you must re-enter the new password'),
  body('password')
    .notEmpty()
    .withMessage('You must enter the new password')
    .custom(async (val, { req }) => {
      // 1- Verify the current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error('There is no user for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error('Incorrect current Password');
      }

      // 2- Verify if the password is confirmed
      if (val !== req.body.passwordConfirmation) {
        throw new Error('Password Confirmation Incorrect');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User ID format'),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Too short User name')
    .isLength({ max: 32 })
    .withMessage('Too long User name'),

  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid Email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already exist'));
        }
      })
    ),

  check('phone')
    .optional()
    .isMobilePhone(['ar-TN', 'ar-SA'])
    .withMessage(
      'Invalid Phone Number: Only accept Tunisian / Saudi Phone numbers'
    ),

  check('profileImage').optional(),

  validatorMiddleware,
];
