import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Feed } from '@/components/feed/feed'

export const metadata = {
  title: 'Home | Sky Aisle',
  description: 'Your feed of posts from people you follow on Sky Aisle',
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

  return <Feed />
}
