import { z } from 'zod'

export const upsertCircuitSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  location: z.string(),
  length: z.number().nullable(),
})

export const deleteCircuitSchema = z.object({
  id: z.number(),
})
