'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Pilot } from '../types'
import { upsertPilot, getScuderia } from '../actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { upsertPilotSchema } from '../schema'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

type PilotUpsertDialogProps = {
  children?: React.ReactNode
  defaultValues?: Pilot
  action?: "edit" | "new"
}

type ScuderiaProps = {
  id: number;
  name: string;
  country: string;
}

export function PilotUpsertDialog({ children, defaultValues, action }: PilotUpsertDialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [scuderias, setScuderias] = useState<ScuderiaProps[]>([]);
  const [selectedScuderia, setSelectedScuderia] = useState<number | null>(null);

  const form = useForm<z.infer<typeof upsertPilotSchema>>({
    resolver: zodResolver(upsertPilotSchema),
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name ?? '',
      age: defaultValues?.age ?? 0,
      nationality: defaultValues?.nationality ?? '',
      scuderia: defaultValues?.scuderiaId.toString()
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true)
    data.scuderiaId = selectedScuderia === null ? defaultValues?.scuderiaId : Number(selectedScuderia);
    const pilotData = {
      id: data.id,
      name: data.name,
      age: data.age,
      nationality: data.nationality,
      scuderiaId: data.scuderiaId,
    };

    await upsertPilot(pilotData);
    router.refresh();

    ref.current?.click();

    let messageTitle = ""
    let messageDescription = ""
    if (action === "edit") {
      messageTitle = 'Pilot updated'
      messageDescription = 'The pilot has been successfully updated.'
    } else {
      messageTitle = 'Pilot created'
      messageDescription = 'A new pilot has been successfully created.'
    }

    toast({
      title: messageTitle,
      description: messageDescription,
    });
    setIsLoading(false)
  })

  useEffect(() => {
    const fetchScuderias = async () => {
      const scuderiasData = await getScuderia();
      setScuderias(scuderiasData);
    };

    fetchScuderias();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={ref}>{children}</div>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <DialogHeader>
              <DialogTitle>New Pilot</DialogTitle>
              <DialogDescription>
                Make changes or create a new pilot here. Click save when you re
                done.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the pilot's name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the full name of the pilot you wish to register or update.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      {...field}
                      onChange={(e) => {
                        form.setValue('age', Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the pilot&apos;s age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the pilot's nationality"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the nationality of the pilot you wish to register or update.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scuderia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scuderia</FormLabel>
                  <FormControl>
                    <Select {...field}
                      onValueChange={(e) => {
                        field.onChange(e)
                        setSelectedScuderia(Number(e))
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a scuderia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {scuderias.map(scuderia => (
                            <SelectItem
                              key={scuderia.id}
                              value={scuderia.id.toString()}
                            >
                              {scuderia.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the scuderia of the pilot you wish to register or update.
                  </FormDescription>
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
