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

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable' 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ 
      email, 
      password, 
      name,
      authProvider: 'local'
    });

    const validationError = user.validateSync();
    if (validationError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(validationError.errors).map(e => e.message)
      });
    }

    await user.save();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        message: 'Server configuration error: JWT_SECRET is not set' 
      });
    }
    
    const token = generateToken(user._id);

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
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }
    
    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError' || error.name === 'MongoError') {
      return res.status(503).json({ 
        message: 'Database error',
        error: error.message 
      });
    }
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(500).json({ 
        message: 'Token generation failed' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors || {}).map(e => e.message)
      });
    }
    
    console.error('Signup error:', error);
    return res.status(500).json({ 
      message: error.message || 'An error occurred during signup',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable' 
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.authProvider === 'google' && !user.password) {
      user.password = password;
      await user.save();
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let isPasswordValid;
    try {
      isPasswordValid = await user.comparePassword(password);
    } catch (bcryptError) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        message: 'Server configuration error: JWT_SECRET is not set' 
      });
    }

    const token = generateToken(user._id);

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
    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError' || error.name === 'MongoError') {
      return res.status(503).json({ 
        message: 'Database error',
        error: error.message 
      });
    }
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(500).json({ 
        message: 'Token generation failed' 
      });
    }

    if (error.message && error.message.includes('bcrypt')) {
      return res.status(500).json({ 
        message: 'Password verification error' 
      });
    }
    
    console.error('Login error:', error);
    next(error);
  }
};

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

export const handleGoogleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    const oauth2Client = getGoogleOAuthClient();

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

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

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable' 
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.authProvider === 'local' && user.password) {
        user.providerId = googleId;
        user.providerData = {
          picture,
          ...user.providerData
        };
        await user.save();
      } else if (user.authProvider === 'google') {
        if (user.providerId !== googleId) {
          user.providerId = googleId;
          user.providerData = {
            picture,
            ...user.providerData
          };
          await user.save();
        }
      }
    } else {
      user = new User({
        email,
        name,
        authProvider: 'google',
        providerId: googleId,
        providerData: {
          picture
        }
      });
      await user.save();
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        message: 'Server configuration error: JWT_SECRET is not set' 
      });
    }

    const token = generateToken(user._id);

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

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable' 
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

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
