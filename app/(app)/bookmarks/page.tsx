export const metadata = {
  title: 'Bookmarks | Sky Aisle',
  description: 'Your saved posts',
}

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="app-shell-header">
        <h1 className="app-shell-title">Bookmarks</h1>
      </div>

      <div className="px-4 py-12 text-center text-muted-foreground">
        <p className="mb-4 text-foreground">No bookmarks yet</p>
        <p className="app-shell-subtitle">
          Save posts to bookmark them for later
        </p>
      </div>
    </div>
  )
}
