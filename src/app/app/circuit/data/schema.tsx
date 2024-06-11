import { z } from "zod"
export const circuitSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
  length: z.number().nullable(),
})

export type Circuit = z.infer<typeof circuitSchema>