'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function RightSidebar() {
  const [trendingTags, setTrendingTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchTrendingTags = async () => {
      try {
        const { data: hashtags } = await supabase
          .from('hashtags')
          .select('*')
          .order('trending_rank', { ascending: true })
          .limit(5)

        setTrendingTags(hashtags || [])
      } catch (error) {
        console.error('Error fetching trending tags:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingTags()
  }, [supabase])

  return (
    <aside className="w-80 sticky top-0 h-screen overflow-y-auto p-4">
      {/* Search Box */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search posts, people..."
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* What's Happening */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-xl font-bold">What&apos;s happening</h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trendingTags.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No trends yet. Start posting!
              </p>
            ) : (
              trendingTags.map((tag) => (
                <div
                  key={tag.id}
                  className="hover:bg-muted p-3 rounded cursor-pointer transition"
                >
                  <Link href={`/search?q=${encodeURIComponent(tag.tag)}`}>
                    <p className="text-xs text-muted-foreground">Trending</p>
                    <p className="font-bold">#{tag.tag}</p>
                    <p className="text-xs text-muted-foreground">
                      {tag.usage_count?.toLocaleString()} posts
                    </p>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        <Button variant="outline" className="w-full mt-4 rounded-full">
          Show more
        </Button>
      </Card>

      {/* Suggestions */}
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div>
                  <p className="text-sm font-bold">User {i}</p>
                  <p className="text-xs text-muted-foreground">@user{i}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </aside>
  )
}
