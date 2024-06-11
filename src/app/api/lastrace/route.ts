import { NextResponse } from 'next/server'
import { prisma } from '@/services/database'

export async function GET() {
  try {
    const race = await prisma.race.findFirst({
      orderBy: {
        id: 'desc',
      },
      include: {
        circuit: true,
        weather: true,
        participants: true,
        winner: true,
      },
    })
    return NextResponse.json(race)
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching race' },
      { status: 500 },
    )
  }
}
