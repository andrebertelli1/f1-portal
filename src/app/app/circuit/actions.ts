'use server'

import { auth } from '@/services/auth'
import { prisma } from '@/services/database'
import { z } from 'zod'
import { deleteCircuitSchema, upsertCircuitSchema } from './schema'

export async function getCircuits() {
  const circuits = await prisma.circuit.findMany({})

  return circuits
}

export async function getWinners() {
  const winners = await prisma.raceParticipation.findMany({})

  return winners
}

export async function upsertCircuit(
  input: z.infer<typeof upsertCircuitSchema>,
) {
  if (!input.name) {
    return {
      error: 'Circuit name is required',
      data: null,
    }
  }

  if (input.id) {
    const circuit = await prisma.circuit.findUnique({
      where: {
        id: input.id,
      },
      select: {
        id: true,
      },
    })

    if (!circuit) {
      return {
        error: 'Not found',
        data: null,
      }
    }

    const updatedCircuit = await prisma.circuit.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        location: input.location,
        length: input.length,
      },
    })

    return {
      error: null,
      data: updatedCircuit,
    }
  }

  const circuit = await prisma.circuit.create({
    data: {
      name: input.name,
      location: input.location,
      length: input.length,
    },
  })

  return circuit
}

export async function deleteCircuit(
  input: z.infer<typeof deleteCircuitSchema>,
) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Not authorized',
      data: null,
    }
  }

  const circuit = await prisma.circuit.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
    },
  })

  if (!circuit) {
    return {
      error: 'Not found',
      data: null,
    }
  }

  await prisma.circuit.delete({
    where: {
      id: input.id,
    },
  })

  return {
    error: 'Circuit successfully deleted',
    data: circuit,
  }
}
