import {
  FileText,
  Star,
  Lightbulb,
  GitPullRequest,
  Tag,
  BarChart3,
} from "lucide-react"

export function Features() {
  const features = [
    {
      icon: FileText,
      title: "AI Summaries",
      description:
        "Get concise, AI-generated summaries of any repository. Understand what a project does in seconds.",
    },
    {
      icon: Star,
      title: "Star Analytics",
      description:
        "Track star history, growth trends, and compare popularity across similar repositories.",
    },
    {
      icon: Lightbulb,
      title: "Cool Facts",
      description:
        "Discover interesting insights about repos: top contributors, busiest days, and hidden gems.",
    },
    {
      icon: GitPullRequest,
      title: "Latest PRs",
      description:
        "Stay updated with the most important pull requests. Filter by impact, size, and status.",
    },
    {
      icon: Tag,
      title: "Version Updates",
      description:
        "Never miss a release. Get notified about new versions, breaking changes, and changelogs.",
    },
    {
      icon: BarChart3,
      title: "Health Metrics",
      description:
        "Assess repository health with metrics on commit frequency, issue resolution, and maintainer activity.",
    },
  ]

  return (
    <section id="features" className="border-b border-border py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to analyze repos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful tools to help you understand, evaluate, and track open source projects.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-accent/20">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
