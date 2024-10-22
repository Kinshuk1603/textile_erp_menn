// src/controllers/millController.ts
import { Request, Response } from "express";
import Mill from "../models/millModel"; // Import the Mongoose model
import { millSchema } from "../validation/millValidation";
import { ZodError } from "zod"; // Import ZodError for handling schema validation errors

// Custom type guard for MongoDB errors
function isMongoError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error;
}

// Create a new mill entry
export const createMill = async (req: Request, res: Response) => {
  try {
    const validatedData = millSchema.parse(req.body);

    const millExists = await Mill.findOne({ millName: validatedData.millName });
    if (millExists) {
      res.status(400).json({ error: "Mill name already exists" });
      return;
    }

    const mill = new Mill(validatedData);
    await mill.save();

    res.status(201).json(mill);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      res.status(400).json({
        error: error.errors.map((err) => err.message), // Return validation error messages
      });
      return;
    }
    if (isMongoError(error) && error.code === 11000) {
      res.status(400).json({ error: "Mill name already exists" });
      return;
    }

    // Catch-all for any other errors (e.g., server errors)
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all mills with pagination and search
export const getMills = async (req: Request, res: Response) => {
  try {
    const page = Array.isArray(req.query.page)
      ? req.query.page[0]
      : req.query.page || "1";
    const limit = Array.isArray(req.query.limit)
      ? req.query.limit[0]
      : req.query.limit || "5";
    const search = Array.isArray(req.query.search)
      ? req.query.search[0]
      : req.query.search || "";

    // Ensure page and limit are valid strings before parsing
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    // Create search query for mill name
    const searchQuery = search
      ? { millName: { $regex: search, $options: "i" } }
      : {};

    const mills = await Mill.find(searchQuery)
      .skip((pageNumber - 1) * limitNumber) // Skip the number of items for pagination
      .limit(limitNumber) // Limit the number of results returned
      .exec();

    const totalMills = await Mill.countDocuments(searchQuery); // Count total documents for pagination

    res.status(200).json({
      totalMills,
      page: pageNumber,
      totalPages: Math.ceil(totalMills / limitNumber),
      mills,
    });
  } catch (error) {
    console.error("Error fetching mills:", error); // Log the error to the console
    res.status(500).json({ error: "Error fetching mills" });
  }
};

// Get a single mill by ID
export const getMillById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mill = await Mill.findById(id);

    if (!mill) {
      res.status(404).json({ error: "Mill not found" });
      return;
    }

    res.status(200).json(mill);
  } catch (error) {
    console.error("Error fetching mills:", error); // Log the error to the console
    res.status(500).json({ error: "Error fetching mill" });
  }
};

// Update mill
export const updateMill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = millSchema.parse(req.body);

    const mill = await Mill.findByIdAndUpdate(id, validatedData, { new: true });

    if (!mill) {
      res.status(404).json({ error: "Mill not found" });
      return;
    }

    res.status(200).json(mill);
  } catch (error) {
    // Type assertion for error as Error
    if (error instanceof ZodError) {
      res.status(400).json({
        error: error.errors.map((err) => err.message), // Return validation error messages
      });
      return;
    }

    // If error is an instance of Error, you can access the message
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // Handle any other types of errors
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete a mill
export const deleteMill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mill = await Mill.findByIdAndDelete(id);

    if (!mill) {
      res.status(404).json({ error: "Mill not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error fetching mills:", error); // Log the error to the console
    res.status(500).json({ error: "Error deleting mill" });
  }
};
