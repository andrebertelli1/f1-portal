import { z } from 'zod'

export const upsertScuderiaSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  country: z.string(),
  pilots: z.array(z.any()).optional(),
})

export const deleteScuderiaSchema = z.object({
  id: z.number(),
  pilots: z.array(z.any()).optional(),
})
