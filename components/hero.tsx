"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Star, GitPullRequest, Tag } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              Now with AI-powered insights
            </div>

            <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Unlock the full potential of{" "}
              <span className="text-accent">GitHub repos</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Get instant summaries, star trends, cool facts, latest pull requests, and version updates 
              on any open source repository. Make informed decisions faster.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </div>
          </div>

          <div className="relative lg:pl-8">
            <div className="rounded-xl border border-border bg-card p-6 shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Github className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">vercel/next.js</p>
                  <p className="text-sm text-muted-foreground">React Framework</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-secondary p-4">
                  <p className="mb-2 text-sm font-medium text-foreground">Summary</p>
                  <p className="text-sm text-muted-foreground">
                    The React Framework for the Web. Used by companies like TikTok, 
                    Twitch, and Hulu to build performant web applications.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-secondary p-3 text-center">
                    <Star className="mx-auto mb-1 h-4 w-4 text-accent" />
                    <p className="text-lg font-semibold text-foreground">128k</p>
                    <p className="text-xs text-muted-foreground">Stars</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3 text-center">
                    <GitPullRequest className="mx-auto mb-1 h-4 w-4 text-accent" />
                    <p className="text-lg font-semibold text-foreground">342</p>
                    <p className="text-xs text-muted-foreground">Open PRs</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3 text-center">
                    <Tag className="mx-auto mb-1 h-4 w-4 text-accent" />
                    <p className="text-lg font-semibold text-foreground">v15.1</p>
                    <p className="text-xs text-muted-foreground">Latest</p>
                  </div>
                </div>

                <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
                  <p className="text-sm font-medium text-accent">Cool Fact</p>
                  <p className="text-sm text-muted-foreground">
                    Next.js receives an average of 500+ commits per month!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
