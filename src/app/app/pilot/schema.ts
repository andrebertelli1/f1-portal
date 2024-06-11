import { z } from 'zod'

export const upsertPilotSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  age: z.number().optional(),
  nationality: z.string(),
  scuderiaId: z.number().optional(),
})

export const deletePilotSchema = z.object({
  id: z.number(),
})
