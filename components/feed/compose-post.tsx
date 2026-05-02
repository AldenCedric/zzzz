'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Loader2, Image, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface ComposePostProps {
  onPostCreated?: (post: any) => void
}

export function ComposePost({ onPostCreated }: ComposePostProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Post content cannot be empty')
      return
    }

    if (content.length > 300) {
      setError('Post must be 300 characters or less')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        setError('You must be logged in to post')
        setLoading(false)
        return
      }

      // Get user's ID
      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', userData.user.id)
        .single()

      if (!userProfile) {
        setError('User profile not found')
        setLoading(false)
        return
      }

      const { data: newPost, error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: userProfile.id,
          content: content.trim(),
        })
        .select(`
          *,
          users!posts_user_id_fkey (
            id,
            handle,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .single()

      if (insertError) {
        setError(insertError.message || 'Failed to create post')
        setLoading(false)
        return
      }

      setContent('')
      if (onPostCreated && newPost) {
        onPostCreated(newPost)
      }
      setLoading(false)
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <Card className="rounded-none border-x-0 border-t border-b-0 bg-card shadow-none">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            {/* Avatar placeholder */}
            <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />

            <div className="flex-1">
              <Textarea
                placeholder="What's happening?!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                className="min-h-[120px] resize-none border-0 p-0 text-lg placeholder:text-muted-foreground focus:ring-0"
              />

              <div className="mt-4 flex items-end justify-between gap-3">
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:bg-primary/10"
                    disabled={loading}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || !content.trim()}
                  className="rounded-full px-6 font-bold"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Posting...' : 'Post'}
                </Button>
              </div>

              {content && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {content.length}/300
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Card>
  )
}
