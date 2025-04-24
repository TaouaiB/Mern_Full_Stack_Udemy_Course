const { check } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
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
    .withMessage('Password is Required')
    .isLength({ min: 6 })
    .withMessage('Min Password Length Should be 6 ')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirmation) {
        throw new Error('Password Confirmation Incorrect');
      }
      return true;
    }),

  check('passwordConfirmation')
    .notEmpty()
    .withMessage('Password confirmation is Required'),

  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is Required')
    .isEmail()
    .withMessage('Invalid Email address'),

  check('password').notEmpty().withMessage('Password is Required'),

  validatorMiddleware,
];
