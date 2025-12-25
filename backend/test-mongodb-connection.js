import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MONGODB_URI is not set in .env file');
  process.exit(1);
}

console.log('🔍 Testing MongoDB Connection...');
console.log(`   URI: ${mongoUri.replace(/:[^:@]+@/, ':****@')}`); // Hide password

const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
};

mongoose.connect(mongoUri, mongoOptions)
  .then(() => {
    console.log('✅ Connection successful!');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection failed!');
    console.error(`   Error: ${err.message}`);
    
    if (mongoUri.includes('mongodb+srv://')) {
      console.error('\n📋 Common MongoDB Atlas Issues:');
      console.error('   1. IP Address Not Whitelisted:');
      console.error('      → Go to MongoDB Atlas → Network Access');
      console.error('      → Click "Add IP Address"');
      console.error('      → Click "Allow Access from Anywhere" (0.0.0.0/0) for testing');
      console.error('      → Wait 1-2 minutes for changes to propagate');
      console.error('');
      console.error('   2. Wrong Username/Password:');
      console.error('      → Check your .env file');
      console.error('      → Special characters in password must be URL-encoded');
      console.error('      → @ becomes %40, : becomes %3A, etc.');
      console.error('');
      console.error('   3. Connection String Format:');
      console.error('      → Should be: mongodb+srv://username:password@cluster.mongodb.net/database');
      console.error('      → Make sure there are no extra spaces or characters');
    }
    
    process.exit(1);
  });

