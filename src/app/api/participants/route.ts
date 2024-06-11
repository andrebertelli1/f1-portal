import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/services/database'

interface ParticipantData {
  id: number
  raceId: number
  pilotId: number
  position: number
}

export async function POST(req: NextRequest) {
  try {
    const participants: ParticipantData[] = await req.json()

    const result = await prisma.raceParticipation.createMany({
      data: participants,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error upserting participants:', error)
    return NextResponse.json(
      { error: 'An error occurred while upserting the participants' },
      { status: 500 },
    )
  }
}
