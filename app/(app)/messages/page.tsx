export const metadata = {
  title: 'Messages | Social Media',
  description: 'Your direct messages',
}

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="app-shell-header">
        <h1 className="app-shell-title">Messages</h1>
      </div>

      <div className="px-4 py-12 text-center text-muted-foreground">
        <p className="mb-4 text-foreground">No conversations yet</p>
        <p className="app-shell-subtitle">
          Start a conversation by visiting someone&apos;s profile
        </p>
      </div>
    </div>
  )
}
