import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/services/database'

interface RaceData {
  id: number
  name: string
  date: Date | null
  weather: number
  temperature: number
  circuit: number
  winner: number
}

export async function POST(req: NextRequest) {
  try {
    const { name, date, weather, temperature, circuit, winner }: RaceData =
      await req.json()
    const race = await prisma.race.create({
      data: {
        name,
        date,
        weather: {
          connect: {
            id: weather,
          },
        },
        temperature,
        circuit: {
          connect: {
            id: circuit,
          },
        },
        winner: {
          connect: {
            id: winner,
          },
        },
      },
    })
    return NextResponse.json(race, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while upserting the race' },
      { status: 500 },
    )
  }
}
