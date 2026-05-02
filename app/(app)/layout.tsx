import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/navigation/sidebar'
import { RightSidebar } from '@/components/navigation/right-sidebar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-w-0 flex-1 max-w-2xl border-x border-border">{children}</main>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  )
}
