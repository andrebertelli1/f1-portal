import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getWinner } from '../actions'
import { Crown } from 'lucide-react'

interface CardStatisticsProps {
  data: RaceProps
  winner: PilotProps
}

type PilotProps = {
  id: number
  name: string
}

type ParticipantsProps = {
  id: number
  raceId: number
  pilotId: number
  position: number
}

type CircuitProps = {
  id: number
  name: string
  location: string
  length: number
  laps: number
}

type WeatherProps = {
  id: number
  condition: string
}

type WinnerProps = {
  id: number
  name: string
}

type RaceProps = {
  id: number
  name: string
  date: Date
  weatherId: number
  weather: WeatherProps
  temperature: number
  circuitId: number
  circuit: CircuitProps
  winnerId: number
  winner: WinnerProps
  participants: ParticipantsProps
}

export default async function CardStatistics({ data }: CardStatisticsProps) {
  const winner = await getWinner(data?.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <p className="text-xl font-bold mb-4">Key Statistics</p>
        </CardTitle>
        <Crown className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Laps</p>
              <p>{data?.circuit.laps ?? 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Race Winner
              </p>
              <p>{winner[0]?.pilot.name ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
