import { z } from "zod"

export const scuderiaSchema = z.object({
  id: z.number(),
  name: z.string(),
  country: z.string(),
  pilots: z.array(z.any()).optional(),
})

export type Scuderia = z.infer<typeof scuderiaSchema>