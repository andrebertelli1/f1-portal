"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Circuit, circuitSchema } from "../../data/schema"
import { useRouter } from "next/navigation"
import { deleteCircuit } from "../../actions"
import { CircuitUpsertDialog } from "../circuit-upsert-dialog"
import { toast } from "@/components/ui/use-toast"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()

  const circuit = circuitSchema.parse(row.original)

  const handleDeleteCircuit = async (circuit: Circuit) => {
    await deleteCircuit({ id: circuit.id })
    router.refresh()

    toast({
      title: 'Deletion Successful',
      description: 'Circuit has been successfully deleted.',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <CircuitUpsertDialog defaultValues={circuit} action="edit">
          <button className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Edit
          </button>
        </CircuitUpsertDialog>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeleteCircuit(circuit)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}