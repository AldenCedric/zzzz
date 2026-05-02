'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PostCard } from './post-card'
import { ComposePost } from './compose-post'

export function Feed() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        
        const { data: postsData, error } = await supabase
          .from('posts')
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
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Error fetching posts:', error)
          setLoading(false)
          return
        }

        setPosts(postsData || [])
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error:', err)
        setLoading(false)
      }
    }

    fetchPosts()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        (payload: any) => {
          setPosts((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [supabase])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10">
        <ComposePost onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} />
      </div>

      <div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No posts yet. Be the first to post!</div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
