import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/emailUtil";
import { generateOTP } from "../utils/otpUtil";
import { loginSchema } from "../validation/userValidation";
import User from "../models/User";
import { z } from "zod";

const router = Router();
// Define Zod schema for validation
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(15),
  role: z.string().nonempty(), // Add role validation
});

// JWT secret key (use a more secure and environment variable in production)
const JWT_SECRET = 'your_secret_key'; // Replace this with your secret key

// Sign-up route
router.post("/signup", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = userSchema.parse(req.body);
    const { email, password, role } = result; // Destructure role

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return; // Return here to stop further execution
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Create new user with isVerified set to false
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      isVerified: false, // Set user as not verified initially
    });
    await newUser.save();

    // Generate OTP and store it
    const otp = generateOTP(); // Generate OTP
    otpStore[email] = otp; // Store OTP for email mapping
    await sendOTPEmail(email, otp); // Send the OTP email

    res.status(200).json({ message: "OTP sent successfully", email });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Store OTP in memory (for demonstration; use a DB in production)
const otpStore: { [email: string]: string } = {}; // Define the type

// Login route
router.post("/login", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = loginSchema.parse(req.body);
    const { email, password } = result;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Generate OTP for further verification
    const otp = generateOTP(); // Generate OTP
    otpStore[email] = otp; // Store OTP for email mapping
    await sendOTPEmail(email, otp); // Send the OTP email
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error during login:", error); // Log the error
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Verify OTP route
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Check if the OTP matches the stored OTP
    if (otpStore[email] && otpStore[email] === otp) {
      delete otpStore[email]; // Remove the OTP after validation

      // Mark the user as verified
      await User.updateOne({ email }, { isVerified: true }); // Update isVerified field

      // Create JWT token
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

      // Optionally, save the token to the user document in the database (if you have a field for it)
      await User.updateOne({ email }, { token }); // Store the token in the user document

      res.status(200).json({ message: "OTP verified successfully", token });
      return;
    } else {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
});

export default router;
