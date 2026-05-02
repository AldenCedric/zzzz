export const metadata = {
  title: 'Bookmarks | Social Media',
  description: 'Your saved posts',
}

export default function BookmarksPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10 p-4">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
      </div>

      <div className="p-8 text-center text-muted-foreground">
        <p className="mb-4">No bookmarks yet</p>
        <p className="text-sm">
          Save posts to bookmark them for later
        </p>
      </div>
    </div>
  )
}
