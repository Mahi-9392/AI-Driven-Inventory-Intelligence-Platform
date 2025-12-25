# Inventory Intelligence Platform - Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory-intelligence
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GROQ_API_KEY=your-groq-api-key-here
NODE_ENV=development
```

3. Make sure MongoDB is running

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will be available at http://localhost:5000

