import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ApiDemo } from "@/components/api-demo"
import { Stats } from "@/components/stats"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ApiDemo />
      <Stats />
      <Features />
      <Pricing />
      <Footer />
    </main>
  )
}
