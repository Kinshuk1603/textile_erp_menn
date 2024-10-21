import { z } from "zod";

export const colorSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    createdBy: z.string().uuid({ message: 'Invalid user ID' }), // Assuming createdBy is a UUID
});

export type ColorInput = z.infer<typeof colorSchema>;
