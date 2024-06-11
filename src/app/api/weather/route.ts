import { NextResponse } from 'next/server'
import { prisma } from '@/services/database'

export async function GET() {
  try {
    const weather = await prisma.weather.findMany()
    return NextResponse.json(weather)
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching weather' },
      { status: 500 },
    )
  }
}
