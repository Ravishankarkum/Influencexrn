# Collabify Backend

This is the backend API for the Collabify influencer marketing platform.

## Setup

1. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/collabify
   JWT_SECRET=your_jwt_secret_key
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

## API Endpoints

- `/api/users` - User authentication and management
- `/api/campaigns` - Campaign management
- `/api/collaborations` - Collaboration management
- `/api/earnings` - Earnings tracking
- `/api/dashboard` - Dashboard data