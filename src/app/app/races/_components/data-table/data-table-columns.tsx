"use client"

import { ColumnDef } from "@tanstack/react-table"  // Importa o tipo ColumnDef do pacote react-table
import { Checkbox } from "@/components/ui/checkbox"  // Importa o componente Checkbox

import { Race } from "../../data/schema"  // Importa o tipo Pilot definido no esquema de dados
import { DataTableColumnHeader } from "./data-table-column-header"  // Importa o componente de cabeçalho de coluna da tabela de dados
import { DataTableRowActions } from "./data-table-row-actions"  // Importa o componente de ações de linha da tabela de dados

import { format } from 'date-fns';

// Define as colunas para a tabela de dados usando o tipo Pilot
export const columns: ColumnDef<Race>[] = [
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
      return <div className="w-[200px]">{row.original.name}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Circuit Name" />
    ),
    cell: ({ row }) => {
      return <div className="w-[200px]">{row.original.circuit ? row.original.circuit.name : "N/A"}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      let dateValue = ""
      dateValue = row.getValue("date")

      const formattedDate = dateValue ? format(new Date(dateValue), 'dd-MM-yyyy') : ''
      return <div className="w-[200px]">{formattedDate}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "weather",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Weather condition" />
    ),
    cell: ({ row }) => {
      return <div className="w-[200px]">{row.original.weather ? row.original.weather.condition : "N/A"}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "temperature",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Temperature" />
    ),
    cell: ({ row }) => {
      return <div className="w-[200px]">{row.original.temperature}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "winner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Winner" />
    ),
    cell: ({ row }) => {
      return <div className="w-[200px]">{row.original.winner?.name}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]