'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Home,
  Bell,
  Mail,
  Bookmark,
  Users,
  MoreHorizontal,
  LogOut,
  Search,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NAVIGATION_ITEMS = [
  { icon: Home, label: 'Home', href: '/home' },
  { icon: Search, label: 'Explore', href: '/explore' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: Mail, label: 'Messages', href: '/messages' },
  { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
  { icon: Users, label: 'People', href: '/people' },
]

export function Sidebar() {
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col overflow-y-auto border-r border-border p-4">
      {/* Logo */}
      <Link href="/home" className="mb-8 block">
        <div className="font-heading text-2xl font-bold tracking-tight">Sky Aisle</div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className="h-11 w-full justify-start gap-3 px-3 text-base font-normal"
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Compose Button */}
      <Button size="lg" className="mb-4 h-12 w-full rounded-full font-bold">
        Post
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="text-left">
                <div className="text-sm font-bold">Your Name</div>
                <div className="text-xs text-muted-foreground">@yourhandle</div>
              </div>
            </div>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/profile">View Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  )
}
