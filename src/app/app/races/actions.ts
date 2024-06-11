'use server'

import { auth } from "@/services/auth";
import { prisma } from "@/services/database";
import { z } from "zod";
import { deleteRaceSchema, upsertRaceSchema } from "./schema";

export async function getRaces() {
  const races = await prisma.race.findMany({
    include: {
      circuit: true,
      weather: true,
      participants: true,
      winner: true,
    },
  })

  return races
}

export async function getCircuits() {
  const circuit = await prisma.circuit.findMany({
  })

  return circuit
}

export async function getWeather() {
  const weather = await prisma.weather.findMany({
  })

  return weather
}

export async function getPilots() {
  const pilot = await prisma.pilot.findMany({
  })

  return pilot
}

export async function getCircuitByID(circuitId: number) {
  const circuit = await prisma.circuit.findMany({
    where: {
      id: circuitId,
    },
  })

  return circuit
}

export async function upsertRace(input: z.infer<typeof upsertRaceSchema>) {
  if (input.id) {
    const race = await prisma.race.findUnique({
      where: {
        id: input.id,
      },
      select: {
        id: true,
      },
    })

    if (!race) {
      return {
        error: 'Not found',
        data: null,
      }
    }

    const updatedRace = await prisma.race.update({
      where: {
        id: input.id,
      },
      data: {
        date: input.date,
        name: input.name,
        temperature: input.temperature,
        circuit: {
          connect: {
            id: input.circuitId
          }
        },
        weather: {
          connect: {
            id: input.weatherId
          }
        },
        winner: {
          connect: {
            id: input.winnerId
          }
        }
      },
    })

    return {
      error: null,
      data: updatedRace,
    }
  }

  const race = await prisma.race.create({
    data: {
      date: input.date,
      circuit: {
        connect: {
          id: input.circuitId
        }
      }
    },
  })
  return race
}

export async function deleteRace(input: z.infer<typeof deleteRaceSchema>) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Not authorized',
      data: null,
    }
  }

  const race = await prisma.race.findUnique({
    where: {
      id: input.id
    },
    select: {
      id: true,
    },
  })

  if (!race) {
    return {
      error: 'Not found',
      data: null,
    }
  }

  await prisma.race.delete({
    where: {
      id: input.id
    },
  })

  return {
    error: 'Race successfully deleted',
    data: race,
  }
}




