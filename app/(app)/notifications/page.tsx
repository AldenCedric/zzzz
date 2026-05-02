export const metadata = {
  title: 'Notifications | Social Media',
  description: 'Your notifications',
}

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="app-shell-header">
        <h1 className="app-shell-title">Notifications</h1>
      </div>

      <div className="px-4 py-12 text-center text-muted-foreground">
        <p className="mb-4 text-foreground">No notifications yet</p>
        <p className="app-shell-subtitle">
          When people engage with your posts or follow you, you&apos;ll see them here
        </p>
      </div>
    </div>
  )
}
