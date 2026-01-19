"use client"

import { Button } from "@/components/ui/button"
import { Github, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type GoogleSession = {
  authenticated: boolean
  email?: string
  name?: string
  picture?: string
}

export function Header() {
  const [googleSession, setGoogleSession] = useState<GoogleSession | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data: GoogleSession = await response.json()
          setGoogleSession(data)
        } else {
          setGoogleSession({ authenticated: false })
        }
      } catch {
        setGoogleSession({ authenticated: false })
      } finally {
        setSessionLoading(false)
      }
    }

    fetchSession()
  }, [])

  const isAuthenticated = googleSession?.authenticated

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
            <Github className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Dandi</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {isAuthenticated ? (
            <>
              <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Pricing
              </Link>
              <Link href="/dashboards" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
              <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Docs
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground/60">Features</span>
              <span className="text-sm text-muted-foreground/60">Pricing</span>
              <span className="text-sm text-muted-foreground/60">Dashboard</span>
              <span className="text-sm text-muted-foreground/60">Docs</span>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {googleSession?.picture ? (
                <img
                  src={googleSession.picture}
                  alt={googleSession.name ?? googleSession.email ?? "Google profile"}
                  className="h-8 w-8 rounded-full border border-border object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : null}
              <span className="hidden text-sm text-muted-foreground md:inline">
                {googleSession?.name ?? googleSession?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await fetch("/api/auth/logout")
                  setGoogleSession({ authenticated: false })
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              disabled={sessionLoading}
              onClick={() => {
                window.location.href = "/api/auth/google"
              }}
            >
              Sign in with Google
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {mobileOpen ? (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="#features"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/dashboards"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Docs
                </Link>
              </>
            ) : (
              <>
                <span className="rounded-lg px-3 py-2 text-sm text-muted-foreground/60">Features</span>
                <span className="rounded-lg px-3 py-2 text-sm text-muted-foreground/60">Pricing</span>
                <span className="rounded-lg px-3 py-2 text-sm text-muted-foreground/60">Dashboard</span>
                <span className="rounded-lg px-3 py-2 text-sm text-muted-foreground/60">Docs</span>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
