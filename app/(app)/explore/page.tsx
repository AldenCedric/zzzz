import { Feed } from '@/components/feed/feed'

export const metadata = {
  title: 'Explore | Social Media',
  description: 'Discover trending posts and topics',
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10 p-4">
        <h1 className="text-2xl font-bold">Explore</h1>
      </div>
      <Feed />
    </div>
  )
}
