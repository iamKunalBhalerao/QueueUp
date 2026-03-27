import { z } from "zod";

export const signUpZodSchema = z.object({
  name: z.string().min(3, "Full Name must be bigger than 3 letters!"),
  email: z.string().min(5, "Email must be bigger than 3 letters!"),
  password: z.string().min(3, "Password must be bigger than 3 letters!"),
});

export const signInZodSchema = z.object({
  email: z.string().min(5, "Email must be bigger than 5 letters!"),
  password: z.string().min(3, "Password must be bigger than 3 letters!"),
});

export const createProjectZodSchema = z.object({
  name: z.string().min(3, "Title must be bigger than 3 letters!"),
});

export const snapShotZodSchema = z.object({
  fsnodeId: z.string().min(1, "fsnodeId is required!"),
  data: z.string().min(1, "Data is required!"), // Array of Base64 strings
});

export const createLinkedInPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  media: z.array(z.string().url("Invalid URL")).optional().default([]),
  scheduledAt: z.string().datetime().optional(),
});

export type CreateLinkedInPostInput = z.infer<typeof createLinkedInPostSchema>;
