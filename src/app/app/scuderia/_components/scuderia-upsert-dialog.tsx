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
} from '@/components/ui/dialog'
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
import { useForm } from 'react-hook-form'
import { Scuderia } from '../types'
import { upsertScuderia } from '../actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { upsertScuderiaSchema } from '../schema'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

type ScuderiaUpsertDialogProps = {
  children?: React.ReactNode
  defaultValues?: Scuderia
  action?: 'edit' | 'new'
}

export function ScuderiaUpsertDialog({
  children,
  defaultValues,
  action,
}: ScuderiaUpsertDialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof upsertScuderiaSchema>>({
    resolver: zodResolver(upsertScuderiaSchema),
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name ?? '',
      country: defaultValues?.country ?? '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true)
    await upsertScuderia(data)
    router.refresh()

    ref.current?.click()

    let messageTitle = ''
    let messageDescription = ''
    if (action === 'edit') {
      messageTitle = 'Scuderia updated'
      messageDescription = 'The scuderia has been successfully updated.'
    } else {
      messageTitle = 'Scuderia created'
      messageDescription = 'A new scuderia has been successfully created.'
    }

    toast({
      title: messageTitle,
      description: messageDescription,
    })
    setIsLoading(false)
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
              <DialogTitle>New Scuderia</DialogTitle>
              <DialogDescription>
                Make changes or create a new scuderia here. Click save when you
                re done.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the scuderia's name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the full name of the scuderia you wish to register or
                    update.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the scuderia's country"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the country of the scuderia you wish to register or
                    update.
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
