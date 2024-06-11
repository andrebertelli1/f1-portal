import { z } from "zod"

const circuitSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
  length: z.number()
});

const weatherSchema = z.object({
  id: z.number(),
  condition: z.string()
});

const pilotSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number(),
  nationality: z.string(),
});

export const raceSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  date: z.date().nullable(),
  weatherId: z.number().optional(),
  weather: weatherSchema.optional(),
  temperature: z.number().optional(),
  circuitId: z.number().optional(),
  circuit: circuitSchema.optional(),
  winnerId: z.number().optional(),
  winner: pilotSchema.optional(),
  participants: z.array(z.any()).optional(),
})

export type Race = z.infer<typeof raceSchema>