import { prisma } from "@/services/database"
import { setParticipantsToRaceSchema, upsertRaceSchema } from "./schema"
import { z } from "zod"

export async function getRaces() {
  const races = await prisma.race.findMany({
    include: {
      circuit: true
    },
  })

  return races
}
export async function getLastRace() {
  const race = await prisma.race.findFirst({
    orderBy: {
      id: "desc"
    },
    include: {
      circuit: true,
      weather: true,
      participants: true,
      winner: true
    },
  })

  return race
}
export async function getCircuits() {
  const response = await fetch('/api/circuits')
  if (response.ok) {
    return response.json()
  } else {
    throw new Error('Failed to fetch circuits')
  }
}
export async function getWeather() {
  const response = await fetch('/api/weather')
  if (response.ok) {
    return response.json()
  } else {
    throw new Error('Failed to fetch weather')
  }
}
export async function getPilots() {
  const response = await fetch('/api/pilots')
  if (response.ok) {
    return response.json()
  } else {
    throw new Error('Failed to fetch pilot')
  }
}
export async function getTop5Pilots(raceId: number) {
  const top5Participants = await prisma.raceParticipation.findMany({
    where: {
      raceId: raceId, // Adicione aqui o ID da corrida específica
    },
    orderBy: {
      position: 'asc', // Ordena por posição em ordem crescente
    },
    take: 5, // Limita a 5 resultados
    include: {
      pilot: {
        include: {
          scuderia: true
        }
      }
    },
  });

  return top5Participants
}
export async function getWinner(raceId: number) {
  const winner = await prisma.raceParticipation.findMany({
    where: {
      raceId: raceId, // Adicione aqui o ID da corrida específica
    },
    orderBy: {
      position: 'asc', // Ordena por posição em ordem crescente
    },
    take: 1, // Limita a 5 resultados
    include: {
      pilot: {
        include: {
          scuderia: true
        }
      }
    },
  });

  return winner
}
export async function getIdLastRace() {
  const response = await fetch('/api/lastrace')
  if (response.ok) {
    return response.json()
  } else {
    throw new Error('Failed to fetch lastrace')
  }
}

export async function upsertRace(raceData: z.infer<typeof upsertRaceSchema>) {
  const response = await fetch('/api/races', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(raceData),
  })

  if (response.ok) {
    return response.json()
  } else {
    throw new Error('Failed to upsert race')
  }
}

export async function setParticipantsToRace(participants: z.infer<typeof setParticipantsToRaceSchema>) {
  const response = await fetch('/api/participants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(participants),
  })

  if (response.ok) {
    return response.json()
  } else {
    throw new Error('Failed to upsert participants')
  }
}

export async function setPilotWinner(raceId: number, pilotId: number) {
  if (pilotId) {
    const winner = prisma.race.update({
      where: {
        id: raceId
      },
      data: {
        winnerId: pilotId
      }
    })

    return winner
  }
}

