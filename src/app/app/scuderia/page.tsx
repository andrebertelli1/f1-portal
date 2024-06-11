import { Metadata } from 'next' // Importa o tipo Metadata do Next.js

import { DataTable } from '@/app/app/scuderia/_components/data-table/data-table' // Importa o componente de tabela de dados
import { columns } from '@/app/app/scuderia/_components/data-table/data-table-columns' // Importa as colunas para a tabela de dados

import { getScuderia } from './actions'

export const metadata: Metadata = {
  title: 'Dashboard', // Título da página
  description: 'Example dashboard app built using the components.', // Descrição da página
}

// Componente funcional Page, assíncrono devido à leitura de tarefas
export default async function Scuderia() {
  const scuderia = await getScuderia() // Obtém as tarefas

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Scuderia</h2>
                <p className="text-muted-foreground">
                  Here&apos;s a list of your scuderias!
                </p>
              </div>
            </div>
            <DataTable data={scuderia} columns={columns} />
          </div>
        </div>
      </div>
    </>
  )
}
