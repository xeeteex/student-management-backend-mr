import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Import database connection
import connectDB from './config/dbConnect.js';

// Import error handler
import errorHandler from './middleware/errorHandler.js';

// Initialize express
const app = express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`);
});

export default app;
