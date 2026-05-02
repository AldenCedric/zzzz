'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/feed/post-card'
import { ArrowLeft, Mail, Link as LinkIcon, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

export default function ProfilePage({ params }: { params: { handle: string } }) {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        setLoading(true)

        // Fetch user by handle
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('handle', params.handle)
          .single()

        if (!userData) {
          router.push('/home')
          return
        }

        setUser(userData)

        // Fetch user's posts
        const { data: postsData } = await supabase
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
          .eq('user_id', userData.id)
          .is('deleted_at', null)
          .order('created_at', { ascending: false })

        setPosts(postsData || [])
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndPosts()
  }, [params.handle, supabase, router])

  const handleFollow = async () => {
    if (!user) return

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('following_id', user.id)

        setIsFollowing(false)
      } else {
        await supabase.from('follows').insert({
          following_id: user.id,
        })

        setIsFollowing(true)
      }
    } catch (error) {
      console.error('Error updating follow:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>User not found</p>
      </div>
    )
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10 p-4 flex items-center gap-4">
        <Link href="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">{user.display_name}</h1>
          <p className="text-sm text-muted-foreground">{posts.length} posts</p>
        </div>
      </div>

      {/* Banner */}
      <div className="h-48 bg-muted" />

      {/* Profile Info Card */}
      <Card className="border-t rounded-none mx-0">
        <div className="p-4">
          {/* Avatar & Follow Button */}
          <div className="flex justify-between items-start mb-4">
            <div className="w-20 h-20 rounded-full bg-muted border-4 border-background -mt-10" />
            <Button onClick={handleFollow} variant={isFollowing ? 'outline' : 'default'}>
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>

          {/* User Info */}
          <div>
            <h2 className="text-2xl font-bold">{user.display_name}</h2>
            <p className="text-muted-foreground">@{user.handle}</p>

            {user.bio && <p className="mt-3 text-foreground">{user.bio}</p>}

            {/* Details */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
              </div>
            </div>

            {/* Followers */}
            <div className="flex gap-4 mt-4 text-sm">
              <div>
                <span className="font-bold">{user.following_count}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold">{user.followers_count}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts */}
      <div className="border-t">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No posts yet
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
