"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for exploring open source projects",
      features: [
        "5 repository analyses per day",
        "Basic summaries",
        "Star count tracking",
        "Latest version info",
        "Community support",
      ],
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "/month",
      description: "For developers who need deeper insights",
      features: [
        "Unlimited repository analyses",
        "AI-powered summaries",
        "Full star history & trends",
        "PR tracking & notifications",
        "Version update alerts",
        "Cool facts & insights",
        "Priority support",
      ],
      cta: "Start free trial",
      highlighted: true,
    },
    {
      name: "Team",
      price: "$39",
      period: "/month",
      description: "For teams evaluating dependencies",
      features: [
        "Everything in Pro",
        "Up to 10 team members",
        "Shared dashboards",
        "Dependency monitoring",
        "Security vulnerability alerts",
        "API access",
        "Dedicated support",
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative rounded-2xl border p-8 transition-all",
                tier.highlighted
                  ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                  : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                  {tier.period && (
                    <span className="ml-1 text-muted-foreground">{tier.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  tier.highlighted
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
