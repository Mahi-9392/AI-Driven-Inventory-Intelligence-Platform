import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      // Password required only for local auth users
      // Check if authProvider is explicitly set to 'google', otherwise require password
      return this.authProvider !== 'google';
    },
    minlength: 6,
    select: false // Don't return password by default in queries
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  providerId: {
    type: String,
    sparse: true // Allows multiple null values but enforces uniqueness for non-null
  },
  providerData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Hash password before saving (only for local auth)
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and user is NOT using Google OAuth
  if (!this.isModified('password')) return next();
  
  // Skip hashing for Google OAuth users (they don't have passwords)
  if (this.authProvider === 'google') return next();
  
  // Hash password for local auth users
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method (works if user has a password)
userSchema.methods.comparePassword = async function(candidatePassword) {
  // If user doesn't have a password, can't compare
  if (!this.password) {
    return false;
  }
  // Compare password regardless of authProvider (user might have both methods)
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);

