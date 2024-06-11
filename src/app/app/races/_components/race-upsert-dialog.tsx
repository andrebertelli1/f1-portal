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
import { Race } from '../types'
import { upsertRace, getCircuits, getWeather, getPilots } from '../actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { upsertRaceSchema } from '../schema'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { z } from 'zod'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'

import { format } from 'date-fns'
import { Input } from '@/components/ui/input'

type RaceUpsertDialogProps = {
  children?: React.ReactNode
  defaultValues?: Race
  action?: 'edit' | 'new'
}

type CircuitsProps = {
  id: number
  name: string
  location: string
  length?: number
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
}

export function RaceUpsertDialog({
  children,
  defaultValues,
  action,
}: RaceUpsertDialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [circuits, setCircuits] = useState<CircuitsProps[]>([])
  const [selectedCircuit, setSelectedCircuit] = useState<number | null>(null)
  const [weather, setWeather] = useState<WeatherProps[]>([])
  const [selectedWeather, setSelectedWeather] = useState<number | null>(null)
  const [pilots, setPilots] = useState<PilotProps[]>([])
  const [selectedPilot, setSelectedPilot] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValues?.date ? new Date(defaultValues.date) : null,
  )

  const form = useForm<z.infer<typeof upsertRaceSchema>>({
    resolver: zodResolver(upsertRaceSchema),
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name ?? '',
      date: defaultValues?.date ? new Date(defaultValues.date) : null,
      weather: defaultValues?.weatherId.toString(),
      temperature: defaultValues?.temperature ?? 0,
      circuit: defaultValues?.circuitId.toString(),
      winner: defaultValues?.winnerId.toString(),
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(false)
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
    data.date = selectedDate ?? defaultValues?.date ?? null

    const raceData = {
      id: data.id,
      name: data.name,
      date: data.date,
      weatherId: data.weatherId,
      temperature: data.temperature,
      circuitId: data.circuitId,
      winnerId: data.winnerId,
    }

    console.log('raceData', raceData)
    await upsertRace(raceData)
    router.refresh()

    ref.current?.click()

    let messageTitle = ''
    let messageDescription = ''
    if (action === 'edit') {
      messageTitle = 'Race updated'
      messageDescription = 'The race has been successfully updated.'
    } else {
      messageTitle = 'Race created'
      messageDescription = 'A new race has been successfully created.'
    }

    toast({
      title: messageTitle,
      description: messageDescription,
    })
    setIsLoading(false)
  })

  useEffect(() => {
    const fetchCircuits = async () => {
      const circuitsData = await getCircuits()
      setCircuits(circuitsData)
    }
    const fetchWeathers = async () => {
      const weatherData = await getWeather()
      setWeather(weatherData)
    }
    const fetchPilot = async () => {
      const pilotsData = await getPilots()
      setPilots(pilotsData)
    }

    fetchCircuits()
    fetchWeathers()
    fetchPilot()
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
              <DialogDescription>
                Make changes to the race here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the pilot's name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the full name of the pilot you want to update.
                  </FormDescription>
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
                  <FormDescription>Enter the date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormDescription>Select a Weather</FormDescription>
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
                      placeholder="Enter temperature"
                      {...field}
                      onChange={(e) => {
                        form.setValue('temperature', Number(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter the pilot&apos;s age.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="circuit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Circuit</FormLabel>
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
                  <FormDescription>Select a circuit</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        <SelectValue placeholder="Select a pilot" />
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
                  <FormDescription>Select a Pilot</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
