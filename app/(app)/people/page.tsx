'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PeoplePage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const { data: usersData } = await supabase
          .from('users')
          .select('*')
          .limit(50)

        setUsers(usersData || [])

        // Fetch current user's following
        const { data: currentUser } = await supabase.auth.getUser()
        if (currentUser.user) {
          const { data: followsData } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', currentUser.user.id)

          setFollowingIds(
            new Set(followsData?.map((f) => f.following_id) || [])
          )
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ following_id: userId }),
      })

      if (response.ok) {
        setFollowingIds((prev) => new Set([...prev, userId]))
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  const handleUnfollow = async (userId: string) => {
    try {
      await fetch(`/api/follows?following_id=${userId}`, {
        method: 'DELETE',
      })

      setFollowingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    } catch (error) {
      console.error('Error unfollowing user:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="app-shell-header space-y-1">
        <h1 className="app-shell-title">People</h1>
        <p className="app-shell-subtitle">Discover and follow interesting people</p>
      </div>

      <Card className="mx-0 rounded-none border-x-0 border-t border-b-0 shadow-none">
        <div className="divide-y">
          {loading ? (
            <div className="px-4 py-12 text-center text-muted-foreground">
              Loading people...
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 py-12 text-center text-muted-foreground">
              No users found
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Link href={`/profile/${user.handle}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
                        <div>
                          <p className="font-bold hover:underline">
                            {user.display_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @{user.handle}
                          </p>
                        </div>
                      </div>
                    </Link>
                    {user.bio && (
                      <p className="text-sm text-foreground mb-2">{user.bio}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {user.followers_count} followers
                    </p>
                  </div>

                  <Button
                    onClick={() =>
                      followingIds.has(user.id)
                        ? handleUnfollow(user.id)
                        : handleFollow(user.id)
                    }
                    variant={followingIds.has(user.id) ? 'outline' : 'default'}
                    size="sm"
                  >
                    {followingIds.has(user.id) ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
