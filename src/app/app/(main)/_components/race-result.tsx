import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getTop5Pilots } from '../actions'

interface RaceResultProps {
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

type PilotProps = {
  id: number
  name: string
  age: number
  photoUrl: string
  nationality: string
  scuderiaId: number
  scuderia: ScuderiaProps
}

type ScuderiaProps = {
  id: number
  name: string
  location: string
  length: number
  laps: number
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
  participants: PilotProps
}

export async function RaceResult({ data }: RaceResultProps) {
  const topParticipants = await getTop5Pilots(data?.id)

  function getInitials(name: string) {
    const names = name.split(' ')
    return names.map((name) => name[0]).join('')
  }
  return (
    <div className="space-y-8">
      {topParticipants?.map((topParticipant) => (
        <div key={topParticipant.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            {topParticipant.pilot?.photoUrl ? (
              <AvatarImage
                className="object-cover"
                src={topParticipant.pilot.photoUrl}
                alt="Avatar"
              />
            ) : (
              <AvatarFallback>
                {getInitials(topParticipant.pilot?.name ?? '')}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {topParticipant.pilot?.name ?? 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              {topParticipant.pilot?.scuderia?.name ?? 'N/A'}
            </p>
          </div>
          <div className="ml-auto font-medium">Tempo da corrida</div>
        </div>
      ))}
    </div>
  )
}
