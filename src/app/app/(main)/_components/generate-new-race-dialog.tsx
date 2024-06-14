'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useEffect, useRef, useState } from 'react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { date, number, z } from 'zod'
import { upsertRaceSchema } from '../schema'
import { Races } from '../types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getCircuits,
  getIdLastRace,
  getPilots,
  getWeather,
  setParticipantsToRace,
  upsertRace,
} from '../actions'
import { toast } from '@/components/ui/use-toast'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

type GenerateNewRaceDialogProps = {
  children?: React.ReactNode
  defaultValues?: Races
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
  nationality: string
  scuderiaId: number
}

export function GenerateNewRaceDialog({
  children,
  defaultValues,
}: GenerateNewRaceDialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [circuits, setCircuits] = useState<CircuitProps[]>([])
  const [selectedCircuit, setSelectedCircuit] = useState<number | null>(null)
  const [weather, setWeather] = useState<WeatherProps[]>([])
  const [selectedWeather, setSelectedWeather] = useState<number | null>(null)
  const [pilots, setPilots] = useState<PilotProps[]>([])
  const [selectedPilot, setSelectedPilot] = useState<number | null>(null)

  const [isLoadingCreate, setIsLoadingCreate] = useState(false)
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false)

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValues?.date ? new Date(defaultValues.date) : null,
  )
  const [actionType, setActionType] = useState<string>('')

  const form = useForm<z.infer<typeof upsertRaceSchema>>({
    resolver: zodResolver(upsertRaceSchema),
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name,
      date: defaultValues?.date,
      weatherId: defaultValues?.weatherId,
      temperature: defaultValues?.temperature,
      circuitId: defaultValues?.circuitId,
      winnerId: defaultValues?.winnerId,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    if (actionType === 'Create') {
      setIsLoadingCreate(true)
      data.circuitId =
        selectedCircuit === null
          ? defaultValues?.circuitId
          : Number(selectedCircuit)
      data.weatherId =
        selectedWeather === null
          ? defaultValues?.weatherId
          : Number(selectedWeather)
      data.winnerId =
        selectedPilot === null ? defaultValues?.winnerId : Number(selectedPilot)
      data.date = selectedDate ?? defaultValues?.date

      const raceData = {
        id: data.id,
        name: data.name,
        date: data.date,
        weather: data.weatherId,
        temperature: data.temperature,
        circuit: data.circuitId,
        winner: data.winnerId,
      }

      try {
        await upsertRace(raceData)
        const lastRaceData = await getIdLastRace()

        if (lastRaceData.id) {
          const numberOfParticipants = pilots.length
          const positions = Array.from(
            { length: numberOfParticipants },
            (_, i) => i + 1,
          )

          // Shuffle the positions array to assign random positions
          for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
              ;[positions[i], positions[j]] = [positions[j], positions[i]]
          }

          const raceParticipations = pilots.map((pilot, index) => ({
            raceId: lastRaceData.id,
            pilotId: pilot.id,
            position: positions[index],
          }))

          await setParticipantsToRace(raceParticipations)
        }

        router.refresh()
        ref.current?.click()
        setIsLoadingCreate(false)
        toast({
          title: 'Race created',
          description: 'A new race has been successfully created.',
        })
      } catch (error) {
        console.error('Failed to upsert race or participants', error)
      }
    } else {
      setIsLoadingGenerate(true)
      const numberOfCircuits = circuits.length
      const numberOfWeathers = weather.length
      const numberOfPilots = pilots.length

      let temperature
      let minTemperature = 0
      let maxTemperature = 0
      let selectedCircuit

      if (numberOfCircuits > 0 && numberOfWeathers > 0 && numberOfPilots > 0) {
        // Gera um índice aleatório para cada array
        const randomCircuitIndex = Math.floor(Math.random() * numberOfCircuits)
        const randomWeatherIndex = Math.floor(Math.random() * numberOfWeathers)
        const randomPilotIndex = Math.floor(Math.random() * numberOfPilots)

        // Seleciona um item aleatório de cada array
        const randomCircuit = circuits[randomCircuitIndex]
        const randomWeather = weather[randomWeatherIndex]
        const randomPilot = pilots[randomPilotIndex]

        // Aqui você pode usar os valores selecionados
        data.circuitId = randomCircuit.id
        data.weatherId = randomWeather.id
        data.winnerId = randomPilot.id

        // Define os intervalos de temperatura para cada tipo de clima
        switch (randomWeather.condition) {
          case 'Sunny':
            minTemperature = 20 // Temperatura mínima para Sunny
            maxTemperature = 37 // Temperatura máxima para Sunny
            break
          case 'Cloudy':
            minTemperature = 15 // Temperatura mínima para Cloudy
            maxTemperature = 30 // Temperatura máxima para Cloudy
            break
          case 'Rainy':
            minTemperature = 10 // Temperatura mínima para Rainy
            maxTemperature = 25 // Temperatura máxima para Rainy
            break
          default:
            console.error('Invalid weather type')
        }

        const selectedCircuit = circuits[randomCircuitIndex]
        // Gera a temperatura aleatória dentro do intervalo definido
        const temperature =
          Math.floor(Math.random() * (maxTemperature - minTemperature + 1)) +
          minTemperature

        const raceData = {
          id: data.id,
          name: `${selectedCircuit.name} Grand Prix`,
          date: new Date(
            new Date().getFullYear(),
            0,
            1 + Math.floor(Math.random() * 365),
          ), // Gera uma data aleatória dentro do ano atual
          weather: data.weatherId,
          temperature,
          circuit: data.circuitId,
          winner: data.winnerId,
        }

        try {
          await upsertRace(raceData)
          const lastRaceData = await getIdLastRace()

          if (lastRaceData.id) {
            const numberOfParticipants = pilots.length
            const positions = Array.from(
              { length: numberOfParticipants },
              (_, i) => i + 1,
            )

            // Shuffle the positions array to assign random positions
            for (let i = positions.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1))
                ;[positions[i], positions[j]] = [positions[j], positions[i]]
            }

            const raceParticipations = pilots.map((pilot, index) => ({
              raceId: lastRaceData.id,
              pilotId: pilot.id,
              position: positions[index],
            }))

            await setParticipantsToRace(raceParticipations)
          }

          router.refresh()
          ref.current?.click()
          setIsLoadingGenerate(false)
          toast({
            title: 'Race created',
            description: 'A new race has been successfully created.',
          })
        } catch (error) {
          console.error('Failed to upsert race or participants', error)
        }
      } else {
        console.error('One or more arrays are empty.')
      }
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      const circuitsData = await getCircuits()
      setCircuits(circuitsData)
      const weatherData = await getWeather()
      setWeather(weatherData)
      const pilotData = await getPilots()
      setPilots(pilotData)
    }

    fetchData()
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={ref}>{children}</div>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <DialogHeader>
              <DialogTitle>New Race</DialogTitle>
              <DialogDescription>Dialog description</DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Name description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="grid">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[280px] justify-start text-left font-normal',
                            !selectedDate && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => setSelectedDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Date description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="circuit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Circuits</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(e) => {
                        field.onChange(e)
                        setSelectedCircuit(Number(e))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a circuit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {circuits.map((circuit) => (
                            <SelectItem
                              key={circuit.id}
                              value={circuit.id.toString()}
                            >
                              {circuit.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Circuit description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4 py-4">
              <FormField
                control={form.control}
                name="weather"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(e) => {
                          field.onChange(e)
                          setSelectedWeather(Number(e))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a weather" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {weather.map((weather) => (
                              <SelectItem
                                key={weather.id}
                                value={weather.id.toString()}
                              >
                                {weather.condition}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Weather description</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="27 °C"
                        {...field}
                        onChange={(e) => {
                          form.setValue('temperature', Number(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormDescription>Temperature description</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="winner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Winner</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(e) => {
                        field.onChange(e)
                        setSelectedPilot(Number(e))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a winner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {pilots.map((pilot) => (
                            <SelectItem
                              key={pilot.id}
                              value={pilot.id.toString()}
                            >
                              {pilot.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Winner description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoadingGenerate}
                onClick={() => setActionType('Generate')}
              >
                {isLoadingGenerate ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Generate race'
                )}
              </Button>
              <Button
                type="submit"
                disabled={isLoadingCreate}
                onClick={() => setActionType('Create')}
              >
                {isLoadingCreate ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Create race'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
