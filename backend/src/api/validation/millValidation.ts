// src/validators/colorValidator.ts
import { z } from 'zod';

// Zod schema for color validation
export const millSchema = z.object({
  millName: z.string().min(1, { message: 'Mill Name is required' }).toUpperCase(),
});

// TypeScript types derived from the Zod schema
export type MillInput = z.infer<typeof millSchema>;
