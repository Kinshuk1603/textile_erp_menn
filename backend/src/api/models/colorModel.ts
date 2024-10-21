// backend/src/api/models/Color.ts

import mongoose, { Document } from 'mongoose';

interface IColor extends Document {
    name: string;
    createdBy: string; // User ID of the person who created this color
    createdAt: Date;
}

const colorSchema = new mongoose.Schema<IColor>({
    name: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Color = mongoose.model<IColor>('Color', colorSchema);

export default Color;
