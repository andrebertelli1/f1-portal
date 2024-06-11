import { z } from 'zod'

const scuderiaSchema = z.object({
  id: z.number(),
  name: z.string(),
  country: z.string(),
})

export const pilotSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().optional(),
  nationality: z.string(),
  scuderiaId: z.number().optional(),
  scuderia: scuderiaSchema.optional(),
  participations: z.array(z.any()).optional(), // Ajuste conforme necessário
})

export type Pilot = z.infer<typeof pilotSchema>
