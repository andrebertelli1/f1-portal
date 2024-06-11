'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function Page() {
  return (
    <div>
      <h1>Auth page</h1>
      <Button onClick={() => signIn('github', { callbackUrl: '/app/table' })}>
        Login com GitHub
      </Button>
    </div>
  )
}
