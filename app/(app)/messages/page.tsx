export const metadata = {
  title: 'Messages | Social Media',
  description: 'Your direct messages',
}

export default function MessagesPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10 p-4">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="p-8 text-center text-muted-foreground">
        <p className="mb-4">No conversations yet</p>
        <p className="text-sm">
          Start a conversation by visiting someone&apos;s profile
        </p>
      </div>
    </div>
  )
}
