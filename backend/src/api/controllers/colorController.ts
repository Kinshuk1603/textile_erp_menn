// backend/src/api/controllers/colorController.ts

import { Request, Response } from "express";
import { z } from "zod"; // Import Zod for validation
import Color from "../models/colorModel";
import { ColorInput, colorSchema } from "../validation/colorValidation";

// Create Color
export const createColor = async (req: Request, res: Response) => {
  console.log("Request Body:", req.body); // Log the incoming request body
  try {
    console.log("Data before validation:", req.body); // Log the raw input
    const parsedData: ColorInput = colorSchema.parse(req.body);
    const newColor = new Color(parsedData);
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    // Handle ZodError separately
    if (error instanceof z.ZodError) {
      console.log("Zod validation errors:", error.errors);
      res.status(400).json({ message: error.errors });
      return;
    }
    // Handle other types of errors
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Failed to create color" });
  }
};

// Get Colors
export const getColors = async (req: Request, res: Response) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Update Color
export const updateColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const parsedData: ColorInput = colorSchema.parse(req.body);
    const updatedColor = await Color.findByIdAndUpdate(id, parsedData, {
      new: true,
    });
    if (!updatedColor) {
      res.status(404).json({ message: "Color not found" });
      return;
    }
    res.json(updatedColor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Failed to update color" });
  }
};

// Delete Color
export const deleteColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    if (!deletedColor) {
      res.status(404).json({ message: "Color not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};
