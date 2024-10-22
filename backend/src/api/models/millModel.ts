// src/models/millModel.ts
import mongoose from 'mongoose';

// Define the mill schema
const millSchema = new mongoose.Schema({
  millName: {
    type: String,
    required: [true, 'Mill Name is required'],
    unique: true, // To prevent duplicate entries
    trim: true,
    uppercase: true, // Automatically transform to uppercase
  },
}, {
  timestamps: true, // Automatically create 'createdAt' and 'updatedAt' fields
});

// Export the Mongoose model for mill
const Mill = mongoose.model('Mill', millSchema);

export default Mill;
