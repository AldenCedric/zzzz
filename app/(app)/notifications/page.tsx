export const metadata = {
  title: 'Notifications | Social Media',
  description: 'Your notifications',
}

export default function NotificationsPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10 p-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <div className="p-8 text-center text-muted-foreground">
        <p className="mb-4">No notifications yet</p>
        <p className="text-sm">
          When people engage with your posts or follow you, you&apos;ll see them here
        </p>
      </div>
    </div>
  )
}
