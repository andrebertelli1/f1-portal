'use server'

import { auth } from "@/services/auth";
import { prisma } from "@/services/database";
import { z } from "zod";
import { deletePilotSchema, upsertPilotSchema } from "./schema";

// Função assíncrona para simular a leitura de um banco de dados para obter tarefas
export async function getPilots() {
  const pilots = await prisma.pilot.findMany({
    include: {
      scuderia: true,
    },
  })

  return pilots
}

export async function getScuderiaByID(scuderiaId: number) {
  const scuderia = await prisma.scuderia.findMany({
    where: {
      id: scuderiaId,
    },
  })

  return scuderia
}

// Função assíncrona para simular a leitura de um banco de dados para obter as scuderias
export async function getScuderia() {
  const scuderia = await prisma.scuderia.findMany({
  })

  return scuderia
}

export async function upsertPilot(input: z.infer<typeof upsertPilotSchema>) {
  if (!input.name) {
    return {
      error: 'Name is required',
      data: null,
    }
  }

  if (input.id) {
    const pilot = await prisma.pilot.findUnique({
      where: {
        id: input.id,
      },
      select: {
        id: true,
      },
    })

    if (!pilot) {
      return {
        error: 'Not found',
        data: null,
      }
    }

    const updatedPilot = await prisma.pilot.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        age: input.age,
        nationality: input.nationality,
        scuderia: {
          connect: {
            id: input.scuderiaId
          }
        }
      },
    })

    return {
      error: null,
      data: updatedPilot,
    }
  }

  const pilot = await prisma.pilot.create({
    data: {
      name: input.name,
      age: input.age,
      nationality: input.nationality,
      scuderia: {
        connect: {
          id: input.scuderiaId
        }
      }
    },
  })

  return pilot
}

export async function deletePilot(input: z.infer<typeof deletePilotSchema>) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Not authorized',
      data: null,
    }
  }

  const pilot = await prisma.pilot.findUnique({
    where: {
      id: input.id
    },
    select: {
      id: true,
    },
  })

  if (!pilot) {
    return {
      error: 'Not found',
      data: null,
    }
  }

  await prisma.pilot.delete({
    where: {
      id: input.id
    },
  })

  return {
    error: 'Todo successfully deleted',
    data: pilot,
  }
}




