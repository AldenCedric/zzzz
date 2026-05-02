import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Users, MessageSquare, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Social Media Platform',
  description: 'Connect with people around the world',
}

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/home')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Sky Aisle
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Sky Aisle
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Create Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-6 rounded-lg">
              <Heart className="h-8 w-8 text-red-500 mb-3" />
              <h3 className="font-bold mb-2">Share & Engage</h3>
              <p className="text-sm text-muted-foreground">
                Express yourself and engage with content you love
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <Users className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-bold mb-2">Follow Friends</h3>
              <p className="text-sm text-muted-foreground">
                Stay connected with people who matter to you
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <MessageSquare className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-bold mb-2">Direct Messages</h3>
              <p className="text-sm text-muted-foreground">
                Have private conversations with friends
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="font-bold mb-2">Discover Trends</h3>
              <p className="text-sm text-muted-foreground">
                Find what&apos;s trending and popular now
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-muted-foreground">Posts Daily</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-muted-foreground">Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to join?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Create an account today and start connecting with millions of people worldwide.
        </p>
        <Button asChild size="lg">
          <Link href="/auth/sign-up">Get Started Now</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Social Media Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
