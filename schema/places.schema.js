import { z } from "zod";

export const placeIdSchema = z.coerce.number().int().positive();

export const placeSchema = z.object({
  placeName: z.string().nullable(),
  address: z.string().nullable(),
  locationLink: z.string().url().nullable(),
  imageUrl: z.string().url().nullable(),
  description: z.string().nullable(),
  // carouselImages: z.array(z.string().url()).nullable(),
});
