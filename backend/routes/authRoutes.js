import express from 'express';
import { signup, login, getGoogleAuthUrl, handleGoogleCallback } from '../controllers/authController.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateSignup = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Traditional email/password routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Google OAuth routes
router.get('/google/url', getGoogleAuthUrl);
router.get('/google/callback', handleGoogleCallback);

export default router;

