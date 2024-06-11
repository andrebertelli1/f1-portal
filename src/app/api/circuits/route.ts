import { NextResponse } from 'next/server'
import { prisma } from '@/services/database'

export async function GET() {
  try {
    const circuits = await prisma.circuit.findMany()
    return NextResponse.json(circuits)
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while fetching circuits' }, { status: 500 })
  }
}