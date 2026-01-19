"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const DEFAULT_URL = "https://api.dandi.dev/api/get-summary"
const DEFAULT_PAYLOAD = JSON.stringify(
  { githubUrl: "https://github.com/assafelovic/gpt-researcher" },
  null,
  2
)

export function ApiDemo() {
  const [url, setUrl] = useState(DEFAULT_URL)
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD)
  const [response, setResponse] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/api/get-summary`)
    }
  }, [])

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = (await response.json()) as { authenticated?: boolean }
          setIsAuthenticated(!!data.authenticated)
        }
      } catch {
        setIsAuthenticated(false)
      }
    }

    fetchSession()
  }, [])

  const handleSend = async () => {
    setError(null)
    setResponse("")

    let parsed: unknown
    try {
      parsed = JSON.parse(payload)
    } catch {
      setError("Payload must be valid JSON.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-demo": "true",
        },
        body: JSON.stringify(parsed),
      })
      const text = await res.text()
      try {
        const parsedResponse = JSON.parse(text)
        setResponse(JSON.stringify(parsedResponse, null, 2))
      } catch {
        setResponse(text)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="border-b border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Live API demo</p>
              <h2 className="text-3xl font-bold text-foreground">Try the API</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Test our API directly in your browser. Edit the request and see real-time results.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDocs((prev) => !prev)}
            >
              View Documentation
            </Button>
          </div>

          {showDocs ? (
            <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How it works</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Use the URL for your environment (local or production).</li>
                <li>Send a JSON body with a <code className="font-mono">githubUrl</code> field.</li>
                <li>The API returns a summary and key facts for the repo.</li>
              </ul>
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Request Settings</p>
                <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                  POST
                </span>
              </div>
              <label className="mt-4 block text-sm font-medium text-foreground">
                URL
                <input
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </label>
              <label className="mt-4 block text-sm font-medium text-foreground">
                Payload (JSON)
                <textarea
                  value={payload}
                  onChange={(event) => setPayload(event.target.value)}
                  rows={8}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
                />
              </label>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button onClick={handleSend} disabled={isLoading || !isAuthenticated}>
                  {isLoading ? "Sending..." : "Send request"}
                </Button>
                {!isAuthenticated ? (
                  <span className="text-sm text-muted-foreground">Sign in to try the API.</span>
                ) : null}
                {error ? <span className="text-sm text-destructive">{error}</span> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">Response</p>
              <div className="mt-2 rounded-xl border border-border bg-background p-3">
                <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap break-words text-xs text-muted-foreground">
                  {response || "Response will appear here."}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
