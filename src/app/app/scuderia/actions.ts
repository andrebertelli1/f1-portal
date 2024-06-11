'use server'

import { auth } from "@/services/auth";
import { prisma } from "@/services/database";
import { z } from "zod";
import { deleteScuderiaSchema, upsertScuderiaSchema } from "./schema";
import { error } from "console";

export async function getScuderia() {
  const scuderias = await prisma.scuderia.findMany({
  })

  return scuderias
}

export async function upsertScuderia(input: z.infer<typeof upsertScuderiaSchema>) {
  if (!input.name) {
    return {
      error: 'Name is required',
      data: null,
    }
  }

  if (input.id) {
    const scuderia = await prisma.scuderia.findUnique({
      where: {
        id: input.id,
      },
      select: {
        id: true,
      },
    })

    if (!scuderia) {
      return {
        error: 'Not found',
        data: null,
      }
    }

    const updatedScuderia = await prisma.scuderia.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        country: input.country
      },
    })

    return {
      error: null,
      data: updatedScuderia,
    }
  }

  const scuderia = await prisma.scuderia.create({
    data: {
      name: input.name,
      country: input.country
    },
  })

  return scuderia
}

export async function deleteScuderia(input: z.infer<typeof deleteScuderiaSchema>) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Not authorized',
      data: null,
    }
  }

  const scuderia = await prisma.scuderia.findUnique({
    where: {
      id: input.id
    },
    select: {
      id: true,
      pilots: true
    },
  })

  if (!scuderia) {
    return {
      error: 'Not found',
      data: null,
    }
  }

  if (!scuderia.pilots) {
    return {
      error: 'There are drivers related to the scuderia',
      data: null,
    }
  }

  await prisma.scuderia.delete({
    where: {
      id: input.id
    },
  })

  return {
    error: 'Scuderia successfully deleted',
    data: scuderia,
  }
}