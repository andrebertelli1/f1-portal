import { PropsWithChildren } from 'react'
import { MainNav } from './_components/main-nav'
import { UserNav } from './_components/user-nav'
import { auth } from '@/services/auth'

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth()

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav user={session?.user} />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <main>{children}</main>
    </>
  )
}
