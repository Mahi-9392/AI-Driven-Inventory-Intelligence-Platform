import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Initialize Google OAuth client
const getGoogleOAuthClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials not configured');
  }
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/google/callback`
  );
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    console.log('=== SIGNUP REQUEST ===');
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('Password length:', password ? password.length : 0);
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected. State:', mongoose.connection.readyState);
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please check MongoDB connection.' 
      });
    }

    // Check if user exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email, 'Auth provider:', existingUser.authProvider);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with explicit local auth provider
    console.log('Creating new user...');
    const userData = { 
      email, 
      password, 
      name,
      authProvider: 'local' // Explicitly set to local for email/password signup
    };
    console.log('User data to create:', { ...userData, password: '***' });

    const user = new User(userData);
    
    // Validate before saving
    console.log('Validating user...');
    const validationError = user.validateSync();
    if (validationError) {
      console.error('❌ Validation error:', validationError);
      console.error('Validation errors:', Object.keys(validationError.errors).map(key => ({
        field: key,
        message: validationError.errors[key].message,
        kind: validationError.errors[key].kind
      })));
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(validationError.errors).map(e => e.message)
      });
    }

    console.log('Saving user to database...');
    await user.save();
    console.log('✅ User saved successfully. ID:', user._id);

    // Generate token
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not set');
      return res.status(500).json({ 
        message: 'Server configuration error: JWT_SECRET is not set in environment variables' 
      });
    }
    
    console.log('Generating JWT token...');
    const token = generateToken(user._id);
    console.log('✅ Token generated successfully');

    console.log('=== SIGNUP SUCCESS ===');
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('=== SIGNUP ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      console.error('❌ Duplicate key error. Duplicate field:', Object.keys(error.keyPattern || {}));
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }
    
    // Handle MongoDB errors specifically
    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError' || error.name === 'MongoError') {
      console.error('❌ MongoDB error:', error.message);
      return res.status(503).json({ 
        message: 'Database error. Please check MongoDB connection.',
        error: error.message 
      });
    }
    
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      console.error('❌ JWT error:', error.message);
      return res.status(500).json({ 
        message: 'Token generation failed. Please check JWT_SECRET configuration.' 
      });
    }
    
    // Handle validation errors from mongoose
    if (error.name === 'ValidationError') {
      console.error('❌ Validation error details:');
      Object.keys(error.errors || {}).forEach(key => {
        console.error(`  - ${key}:`, error.errors[key].message);
      });
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors || {}).map(e => e.message)
      });
    }
    
    // Generic error
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({ 
      message: error.message || 'An error occurred during signup',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('=== LOGIN REQUEST ===');
    console.log('Email:', email);
    console.log('Password provided:', password ? 'Yes (length: ' + password.length + ')' : 'No');
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected. State:', mongoose.connection.readyState);
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please check MongoDB connection.' 
      });
    }

    // Find user (include password field for local auth)
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found:');
    console.log('  - ID:', user._id);
    console.log('  - Email:', user.email);
    console.log('  - Name:', user.name);
    console.log('  - Auth Provider:', user.authProvider);
    console.log('  - Has password:', !!user.password);
    console.log('  - Password length:', user.password ? user.password.length : 0);

    // Check if user is OAuth-only (no password) - provide helpful message
    if (user.authProvider === 'google' && !user.password) {
      console.log('❌ User is Google OAuth only. Cannot login with password.');
      return res.status(401).json({ 
        message: 'This account uses Google sign-in. Please use "Continue with Google" to sign in, or set a password for your account first.',
        code: 'GOOGLE_ONLY_ACCOUNT',
        canSetPassword: true
      });
    }

    // Verify password - user must have a password to login with email/password
    if (!user.password) {
      console.log('❌ User has no password set. Cannot login with password.');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing password...');
    console.log('  - Stored password hash:', user.password ? user.password.substring(0, 20) + '...' : 'none');
    console.log('  - Auth provider:', user.authProvider);
    
    let isPasswordValid;
    try {
      isPasswordValid = await user.comparePassword(password);
      console.log('Password valid:', isPasswordValid);
    } catch (bcryptError) {
      console.error('❌ Bcrypt comparison error:', bcryptError.message);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!isPasswordValid) {
      console.log('❌ Password comparison failed. Invalid password.');
      if (user.authProvider === 'google') {
        console.log('   Note: This account was created via Google OAuth.');
        console.log('   The stored password may not match. Use Google sign-in or set/reset password.');
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not set');
      return res.status(500).json({ 
        message: 'Server configuration error: JWT_SECRET is not set' 
      });
    }

    console.log('Generating JWT token...');
    const token = generateToken(user._id);
    console.log('✅ Token generated successfully');

    console.log('=== LOGIN SUCCESS ===');
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle MongoDB errors
    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError' || error.name === 'MongoError') {
      console.error('❌ MongoDB error:', error.message);
      return res.status(503).json({ 
        message: 'Database error. Please check MongoDB connection.',
        error: error.message 
      });
    }
    
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      console.error('❌ JWT error:', error.message);
      return res.status(500).json({ 
        message: 'Token generation failed. Please check JWT_SECRET configuration.' 
      });
    }

    // Handle bcrypt errors
    if (error.message && error.message.includes('bcrypt')) {
      console.error('❌ Bcrypt error:', error.message);
      return res.status(500).json({ 
        message: 'Password verification error' 
      });
    }
    
    console.error('❌ Unexpected error:', error);
    next(error);
  }
};

// Google OAuth: Get authorization URL
export const getGoogleAuthUrl = async (req, res, next) => {
  try {
    const oauth2Client = getGoogleOAuthClient();
    
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      include_granted_scopes: true
    });

    res.json({ authUrl });
  } catch (error) {
    console.error('Google OAuth URL generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate Google OAuth URL',
      error: error.message 
    });
  }
};

// Google OAuth: Handle callback and authenticate
export const handleGoogleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    const oauth2Client = getGoogleOAuthClient();

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const name = payload.name || payload.email?.split('@')[0] || 'User';
    const picture = payload.picture;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please check MongoDB connection.' 
      });
    }

    // Find existing user by email
    console.log('=== GOOGLE OAUTH CALLBACK ===');
    console.log('Looking for user with email:', email);
    let user = await User.findOne({ email });

    if (user) {
      console.log('✅ Existing user found:');
      console.log('  - ID:', user._id);
      console.log('  - Current authProvider:', user.authProvider);
      console.log('  - Has password:', !!user.password);
      console.log('  - Has providerId:', !!user.providerId);

      // User exists - link Google OAuth while preserving existing password
      if (user.authProvider === 'local' && user.password) {
        // User signed up with email/password first - KEEP their password and authProvider
        // Just add Google OAuth info so they can use both methods
        console.log('  → User has email/password. Preserving password, adding Google OAuth info.');
        user.providerId = googleId;
        user.providerData = {
          picture,
          ...user.providerData
        };
        // Keep authProvider as 'local' - they can use both methods now
        await user.save();
        console.log('  ✅ Updated: User can now use BOTH email/password AND Google OAuth');
      } else if (user.authProvider === 'google') {
        // Already a Google user - just update provider info if needed
        if (user.providerId !== googleId) {
          console.log('  → Updating Google provider ID');
          user.providerId = googleId;
          user.providerData = {
            picture,
            ...user.providerData
          };
          await user.save();
        } else {
          console.log('  → Google OAuth info already up to date');
        }
      }
    } else {
      // New user - create account with Google OAuth only
      console.log('  → Creating new user with Google OAuth');
      user = new User({
        email,
        name,
        authProvider: 'google',
        providerId: googleId,
        providerData: {
          picture
        }
        // No password for new OAuth users
      });
      await user.save();
      console.log('  ✅ New Google OAuth user created. ID:', user._id);
    }

    // Generate JWT token (same as regular login)
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        message: 'Server configuration error: JWT_SECRET is not set' 
      });
    }

    const token = generateToken(user._id);

    // Redirect to frontend with token and user data
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/google/success?token=${token}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&id=${user._id}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const errorMessage = encodeURIComponent(
      error.message || 'Authentication failed. Please try again.'
    );
    res.redirect(`${frontendUrl}/auth/google/error?error=${errorMessage}`);
  }
};

// Set password for Google OAuth users (or update password for any user)
export const setPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable' 
      });
    }

    console.log('=== SET PASSWORD REQUEST ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:');
    console.log('  - Auth Provider:', user.authProvider);
    console.log('  - Has existing password:', !!user.password);

    // Set the password (will be hashed by pre-save hook)
    user.password = password;
    
    // If user was Google-only, update authProvider to allow both methods
    // But keep it as 'google' so they can still use Google OAuth
    // The password field will now be set, allowing email/password login too
    
    await user.save();
    console.log('✅ Password set successfully');

    res.json({
      message: 'Password set successfully. You can now log in with email and password.',
      success: true
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ 
      message: 'Failed to set password',
      error: error.message 
    });
  }
};

