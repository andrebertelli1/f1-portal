'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import { format } from 'date-fns'
import { ReceiptText } from 'lucide-react'

interface CardRaceDetailsProps {
  title: string
  data: RaceProps
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

type RaceProps = {
  id: number
  name: string
  date: Date
  weatherId: number
  weather: WeatherProps
  temperature: number
  circuitId: number
  circuit: CircuitProps
  participants: Array<number>
}

export default function CardRaceDetails({ data }: CardRaceDetailsProps) {
  const formattedDate = data?.date
    ? format(new Date(data.date), 'MMMM d, yyyy')
    : 'N/A'

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <p className="text-xl font-bold mb-4">Race Details</p>
        </CardTitle>
        <ReceiptText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Race</p>
              <p>{data?.name ?? 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Circuit</p>
              <p>{data?.circuit.name ?? 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Date</p>
              <p>{formattedDate}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Weather</p>
              <p>
                {data?.weather.condition ?? 'N/A'}, {data?.temperature ?? 'N/A'}
                °C
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
