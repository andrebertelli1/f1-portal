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

import { Scuderia, scuderiaSchema } from "../../data/schema"
import { useRouter } from "next/navigation"
import { deleteScuderia } from "../../actions"
import { ScuderiaUpsertDialog } from "../scuderia-upsert-dialog"
import { toast } from "@/components/ui/use-toast"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()

  const scuderia = scuderiaSchema.parse(row.original)

  const handleDeleteScuderia = async (scuderia: Scuderia) => {
    await deleteScuderia({ id: scuderia.id })
    router.refresh()

    toast({
      title: 'Deletion Successful',
      description: 'Scuderia has been successfully deleted.',
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
        <ScuderiaUpsertDialog defaultValues={scuderia} action="edit">
          <button className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Edit
          </button>
        </ScuderiaUpsertDialog>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeleteScuderia(scuderia)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}