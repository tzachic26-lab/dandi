"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 px-4 py-12 text-white sm:px-6 lg:px-10">
      <main className="mx-auto max-w-4xl rounded-3xl border border-white/20 bg-white/5 p-6 shadow-2xl shadow-black/50">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.6em] text-cyan-300">API Playground</p>
          <h1 className="text-3xl font-semibold">Protected surface</h1>
          <p className="text-sm text-slate-300">{statusMessage}</p>
        </div>

        {status !== "valid" && (
          <div className="mt-8 space-y-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
              <span>Vault key</span>
              <input
                value={keyInput}
                onChange={(event) => setKeyInput(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                placeholder="dandy-..."
              />
            </label>
            {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleVerifyKey}
                disabled={status === "verifying"}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "verifying" ? "Verifying…" : "Unlock playground"}
              </button>
              <button
                type="button"
                onClick={handleGoBack}
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        )}

        {status === "valid" && (
          <div className="mt-8 space-y-4 rounded-2xl border border-white/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 text-sm text-slate-100">
            <p className="text-lg font-semibold text-cyan-300">{statusMessage}</p>
            <p>
              The playground is now unlocked. You can build queries, monitor usage, and
              inspect responses that leverage the key you just validated.
            </p>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/80">
              This portion represents the protected app experience and will only appear
              after a successful verification.
            </div>
            <button
              type="button"
              onClick={handleGoBack}
              className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-white/20 transition hover:border-white hover:bg-white/20"
            >
              Back to dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlaygroundPage;

