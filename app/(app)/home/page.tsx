import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Feed } from '@/components/feed/feed'

export const metadata = {
  title: 'Home | Social Media',
  description: 'Your feed of posts from people you follow',
}

export default async function HomePage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Feed />
    </div>
  )
}
