import { z } from "zod";

export const upsertRaceSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  date: z.date().optional(),
  weatherId: z.number().optional(),
  temperature: z.number().optional(),
  circuitId: z.number().optional(),
  winnerId: z.number().optional()
})

export const setParticipantsToRaceSchema = z.object({
  id: z.number().optional(),
  raceId: z.number(),
  pilotId: z.number(),
  position: z.number()
})