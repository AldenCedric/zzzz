import Link from "next/link"
import { Icons } from "@/components/icons"
import { ScrollToTopButton } from "@/components/scroll-to-top-button"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-lg">
      <div className="container flex flex-col gap-10 py-16">
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-heading text-xl tracking-tight">Sky Aisle</span>
            </Link>
            <p className="text-muted-foreground max-w-sm opacity-70">
              Sky Aisle
            </p>
            <div className="flex gap-4">
              <Link href="https://x.com" target="_blank" rel="noreferrer" className="glassmorphic-icon">
                <Icons.twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                <span className="sr-only">X</span>
              </Link>
              <Link href="https://github.com" target="_blank" rel="noreferrer" className="glassmorphic-icon">
                <Icons.gitHub className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://discord.com" target="_blank" rel="noreferrer" className="glassmorphic-icon">
                <Icons.discord className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                <span className="sr-only">Discord</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground opacity-70">
            &copy; {new Date().getFullYear()} Sky Aisle. All rights reserved.
          </p>
        </div>
      </div>
      <ScrollToTopButton />
    </footer>
  )
}
