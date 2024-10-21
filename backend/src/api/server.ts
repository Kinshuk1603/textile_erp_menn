import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth'; // Import auth routes
import colorRoutes from './routes/colorRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON bodies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI as string)
.then(() => {
  console.log('MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Use authentication routes
app.use('/api/auth', authRoutes); // Use auth routes under /api/auth
// Use the color routes
app.use('/api', colorRoutes); // Prefix with /api or adjust as needed

// Sample route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
