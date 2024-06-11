'use client'

import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/app"
        className={cn([
          "text-sm font-medium transition-colors hover:text-primary",
          !isActive('/app') && 'text-muted-foreground'
        ])}
      >
        Home
      </Link>
      <Link
        href="/app/pilot"
        className={cn([
          "text-sm font-medium transition-colors hover:text-primary",
          !isActive('/app/pilot') && 'text-muted-foreground'
        ])}
      >
        Pilot
      </Link>
      <Link
        href="/app/scuderia"
        className={cn([
          "text-sm font-medium transition-colors hover:text-primary",
          !isActive('/app/scuderia') && 'text-muted-foreground'
        ])}
      >
        Scuderia
      </Link>
      <Link
        href="/app/circuit"
        className={cn([
          "text-sm font-medium transition-colors hover:text-primary",
          !isActive('/app/circuit') && 'text-muted-foreground'
        ])}
      >
        Circuit
      </Link>
      <Link
        href="/app/races"
        className={cn([
          "text-sm font-medium transition-colors hover:text-primary",
          !isActive('/app/races') && 'text-muted-foreground'
        ])}
      >
        Races
      </Link>
    </nav>
  )
}