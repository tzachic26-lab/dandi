"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

type PlaygroundStatus = "idle" | "verifying" | "valid" | "invalid" | "error";

const PlaygroundPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<PlaygroundStatus>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Enter a valid vault key to unlock the playground."
  );
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerifyKey = async () => {
    const trimmedKey = keyInput.trim();
    if (!trimmedKey) {
      setError("Enter your API key to continue.");
      return;
    }

    setError(null);
    setStatus("verifying");
    setStatusMessage("Validating key…");

    try {
      const response = await fetch("/api/keys/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: trimmedKey }),
      });

      if (response.status === 401) {
        const body = await response.json().catch(() => null);
        setStatus("invalid");
        setStatusMessage(body?.message ?? "Key was not found.");
        setError("Please double-check the key and try again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to verify the key right now.");
      }

      setStatus("valid");
      setStatusMessage("Key verified. Welcome to the protected playground.");
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err instanceof Error ? err.message : "Unable to reach the verification service."
      );
      setError("Try again in a moment.");
    }
  };

  const handleGoBack = () => {
    router.push("/dashboards");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="flex w-full shrink-0 flex-col gap-4 rounded-[30px] border border-border bg-card p-6 shadow-sm lg:w-72">
            <div className="text-lg font-bold">Dandy</div>
            <nav className="space-y-2 text-sm">
              <Link
                href="/dashboards"
                className="flex min-h-[44px] w-full items-center gap-3 rounded-2xl border border-border bg-secondary px-4 font-semibold text-muted-foreground hover:bg-secondary/80"
              >
                Overview
              </Link>
              <div className="flex min-h-[44px] w-full items-center gap-3 rounded-2xl border border-primary/40 bg-primary/10 px-4 font-semibold text-foreground">
                API Playground
              </div>
            </nav>
          </aside>
          <section className="flex-1 rounded-3xl border border-border bg-card p-6 text-foreground shadow-sm sm:p-8">
        <div className="space-y-4">
          <nav className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            <Link href="/" className="transition hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>API Playground</span>
          </nav>
          <p className="text-xs uppercase tracking-[0.6em] text-muted-foreground">API Playground</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">Protected surface</h1>
          <p className="text-sm text-muted-foreground">{statusMessage}</p>
        </div>

        {status !== "valid" && (
          <div className="mt-8 space-y-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
              <span>Vault key</span>
              <input
                value={keyInput}
                onChange={(event) => setKeyInput(event.target.value)}
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="dandy-..."
              />
            </label>
            {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={handleVerifyKey}
                disabled={status === "verifying"}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
              >
                {status === "verifying" ? "Verifying…" : "Unlock playground"}
              </Button>
              <Button type="button" variant="outline" onClick={handleGoBack} className="w-full sm:w-auto">
                Back to dashboard
              </Button>
            </div>
          </div>
        )}

        {status === "valid" && (
          <div className="mt-8 space-y-4 rounded-2xl border border-border bg-secondary p-4 text-sm text-foreground">
            <p className="text-lg font-semibold text-primary">{statusMessage}</p>
            <p>
              The playground is now unlocked. You can build queries, monitor usage, and
              inspect responses that leverage the key you just validated.
            </p>
            <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
              This portion represents the protected app experience and will only appear
              after a successful verification.
            </div>
            <Button type="button" variant="outline" onClick={handleGoBack}>
              Back to dashboard
            </Button>
          </div>
        )}
        </section>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PlaygroundPage;

