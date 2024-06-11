import { NextResponse } from 'next/server'
import { prisma } from '@/services/database'

export async function GET() {
  try {
    const pilots = await prisma.pilot.findMany()
    return NextResponse.json(pilots)
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching pilots' },
      { status: 500 },
    )
  }
}
