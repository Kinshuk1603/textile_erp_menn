import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  otp: string;
  otpExpires: number;
  role: string; // Add role field
  isVerified: boolean; // Add isVerified field
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Number },
  role: { type: String, required: true }, // Add required validation for role
  isVerified: { type: Boolean, default: false }, // Add isVerified field with default value
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
