"use client"

import { ColumnDef } from "@tanstack/react-table"  // Importa o tipo ColumnDef do pacote react-table
import { Checkbox } from "@/components/ui/checkbox"  // Importa o componente Checkbox

import { Scuderia } from "../../data/schema"  // Importa o tipo Pilot definido no esquema de dados
import { DataTableColumnHeader } from "./data-table-column-header"  // Importa o componente de cabeçalho de coluna da tabela de dados
import { DataTableRowActions } from "./data-table-row-actions"  // Importa o componente de ações de linha da tabela de dados

// Define as colunas para a tabela de dados usando o tipo Pilot
export const columns: ColumnDef<Scuderia>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[10px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("country")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]