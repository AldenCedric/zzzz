import { Feed } from '@/components/feed/feed'

export const metadata = {
  title: 'Explore | Social Media',
  description: 'Discover trending posts and topics',
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="app-shell-static-title-bar">
        <h1 className="app-shell-title">Explore</h1>
      </div>
      <Feed />
    </div>
  )
}
