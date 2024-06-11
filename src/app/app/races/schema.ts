import { z } from 'zod'

export const upsertRaceSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  date: z.date().nullable(),
  weatherId: z.number().optional(),
  temperature: z.number().optional(),
  circuitId: z.number().optional(),
  winnerId: z.number().optional()
})

export const deleteRaceSchema = z.object({
  id: z.number(),
})
