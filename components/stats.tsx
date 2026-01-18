export function Stats() {
  const stats = [
    { value: "50k+", label: "Repositories analyzed", description: "and counting" },
    { value: "10M+", label: "Insights generated", description: "for developers" },
    { value: "99.9%", label: "Uptime", description: "reliable service" },
    { value: "< 2s", label: "Analysis time", description: "lightning fast" },
  ]

  return (
    <section className="border-b border-border bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
