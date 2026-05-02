'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Mail } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SignUpSuccessPage() {
  const [email, setEmail] = useState<string>('')
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is already authenticated, redirect to home
        router.push('/home')
      } else {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [supabase.auth, router])

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Account Created!</CardTitle>
            <CardDescription>Welcome to our social media community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                A confirmation email has been sent. Please check your inbox and click the link to verify your email address.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                After confirming your email, you&apos;ll be able to sign in and start exploring.
              </p>

              <Button asChild className="w-full">
                <Link href="/auth/login">Return to Sign In</Link>
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button className="text-primary hover:underline font-medium">
                request a new confirmation
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
