'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface PostCardProps {
  post: any
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const supabase = createClient()

  const handleLike = async () => {
    const newLikedState = !liked
    setLiked(newLikedState)
    setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1))

    if (newLikedState) {
      const { error } = await supabase.from('post_engagements').insert({
        post_id: post.id,
        engagement_type: 'like',
      })

      if (error) {
        setLiked(false)
        setLikesCount((prev) => prev - 1)
        console.error('Error liking post:', error)
      }
    } else {
      const { error } = await supabase
        .from('post_engagements')
        .delete()
        .eq('post_id', post.id)
        .eq('engagement_type', 'like')

      if (error) {
        setLiked(true)
        setLikesCount((prev) => prev + 1)
        console.error('Error unliking post:', error)
      }
    }
  }

  const createdAt = new Date(post.created_at)
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true })

  return (
    <Card className="rounded-none border-x-0 border-t border-b-0 shadow-none">
      <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${post.users.handle}`} className="hover:underline">
                  <div className="flex items-center gap-1">
                    <span className="font-bold truncate">{post.users.display_name}</span>
                    {post.users.is_verified && (
                      <span className="text-blue-500 text-xs">✓</span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-sm">@{post.users.handle}</span>
                </Link>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Time */}
            <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>

            {/* Content */}
            <p className="mt-3 text-foreground whitespace-pre-wrap break-words">{post.content}</p>

            {/* Media */}
            {post.media_urls && post.media_urls.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl overflow-hidden bg-muted">
                {post.media_urls.map((url: string, idx: number) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Post media"
                    className="w-full h-32 object-cover"
                  />
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-4 mt-3 py-2 text-xs text-muted-foreground border-t">
              <span>{post.replies_count} replies</span>
              <span>{post.reposts_count} reposts</span>
              <span>{likesCount} likes</span>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-3 py-2 text-muted-foreground border-t max-w-xs">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 hover:text-blue-500 hover:bg-blue-500/10"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="text-xs">Reply</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 hover:text-green-500 hover:bg-green-500/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="text-xs">Share</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex-1 ${
                  liked
                    ? 'text-red-500 bg-red-500/10'
                    : 'hover:text-red-500 hover:bg-red-500/10'
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                <span className="text-xs">Like</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
