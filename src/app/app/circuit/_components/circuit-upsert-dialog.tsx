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
import { useRef, useState } from 'react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { useForm } from 'react-hook-form'
import { Circuit } from '../types'
import { upsertCircuit } from '../actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { upsertCircuitSchema } from '../schema'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

type CircuitUpsertDialogProps = {
  children?: React.ReactNode
  defaultValues?: Circuit
  action?: "edit" | "new"
}

export function CircuitUpsertDialog({ children, defaultValues, action }: CircuitUpsertDialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof upsertCircuitSchema>>({
    resolver: zodResolver(upsertCircuitSchema),
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name ?? '',
      location: defaultValues?.location ?? '',
      length: defaultValues?.length ?? 0
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    const circuitData = {
      id: data.id,
      name: data.name,
      location: data.location,
      length: data.length
    };

    await upsertCircuit(circuitData);
    router.refresh();

    ref.current?.click();

    let messageTitle = ""
    let messageDescription = ""
    if (action === "edit") {
      messageTitle = 'Circuit updated'
      messageDescription = 'The circuit has been successfully updated.'
    } else {
      messageTitle = 'Circuit created'
      messageDescription = 'A new circuit has been successfully created.'
    }

    toast({
      title: messageTitle,
      description: messageDescription,
    });
    setIsLoading(false);
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={ref}>{children}</div>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <DialogHeader>
              <DialogTitle>New Circuit</DialogTitle>
              <DialogDescription>
                Make changes or create a new circuit here. Click save when you re done.
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
                      placeholder="Enter the circuit's name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the full name of the circuit you wish to register or update.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the race location"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the location.
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
