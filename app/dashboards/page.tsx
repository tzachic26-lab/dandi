"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

type ApiKey = {
  id: string;
  name: string;
  description: string | null;
  key: string;
  createdAt: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatKey = (value: string) => {
  const prefixMatch = value.match(/^([^-]+-)/);
  const prefix = prefixMatch?.[1] ?? value.slice(0, 6);
  const maskedCount = Math.max(value.length - prefix.length, 6);
  return `${prefix}${"*".repeat(maskedCount)}`;
};

const cards = [
  { label: "Current plan", value: "Researcher" },
  { label: "Usage", value: "0 / 1,000 credits" },
  { label: "Billing", value: "Monthly plan" },
];

type NavItem = {
  label: string;
  href?: string;
  highlight?: boolean;
  icon?: boolean;
};

const navItems: NavItem[] = [
  { label: "Overview" },
  { label: "API Playground", href: "/playground", highlight: true, icon: true },
  { label: "Use Cases" },
  { label: "Billing" },
  { label: "Settings" },
];

const PlayIcon = () => (
  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-sm">
    <span
      className="ml-0.5 h-3 w-3 rotate-[10deg] transform border-[5px] border-l-transparent border-t-transparent border-b-primary border-r-primary"
      aria-hidden="true"
    />
  </span>
);


type GoogleSession = {
  authenticated: boolean;
  email?: string;
  name?: string;
  picture?: string;
};


export default function Home() {
  const headingId = useId();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [googleSession, setGoogleSession] = useState<GoogleSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;

    const fetchKeys = async () => {
      if (!googleSession?.authenticated) {
        setKeys([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/keys");
        if (!response.ok) {
          throw new Error("Unable to load API keys");
        }

        const data: ApiKey[] = await response.json();
        setKeys(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchKeys();
  }, [googleSession, sessionLoading]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data: GoogleSession = await response.json();
          setGoogleSession(data);
        } else {
          setGoogleSession({ authenticated: false });
        }
      } catch {
        // ignore
        setGoogleSession({ authenticated: false });
      } finally {
        setSessionLoading(false);
      }
    };

    fetchSession();
  }, []);

  const isAuthenticated = googleSession?.authenticated;

  const handleOpenEdit = (key: ApiKey) => {
    setEditingKey(key);
    setEditName(key.name);
    setEditDescription(key.description ?? "");
  };

  const handleCloseEdit = () => {
    setEditingKey(null);
    setSavingEdit(false);
  };

  const handleSaveEdit = async () => {
    if (!editingKey) return;

    setSavingEdit(true);
    try {
      const response = await fetch(`/api/keys/${editingKey.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update key");
      }

      const updated: ApiKey = await response.json();
      setKeys((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      handleCloseEdit();
      setNotice({ type: "success", message: "Key updated successfully." });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update");
      setNotice({ type: "error", message: "Unable to update the key." });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCreateKey = async () => {
    if (!createName.trim()) {
      setNotice({ type: "error", message: "Name is required." });
      return;
    }
    setCreatingKey(true);
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName.trim(),
          description: createDescription.trim(),
        }),
      });
      if (!response.ok) throw new Error("Unable to create key");
      const newKey: ApiKey = await response.json();
      setKeys((current) => [newKey, ...current]);
      setNotice({ type: "success", message: "Key created!" });
      setIsCreating(false);
      setCreateName("");
      setCreateDescription("");
    } catch {
      setNotice({ type: "error", message: "Unable to create key." });
    } finally {
      setCreatingKey(false);
    }
  };

  const handleCopyKey = async (key: ApiKey) => {
    try {
      await navigator.clipboard.writeText(key.key);
      setNotice({ type: "success", message: "Key copied to clipboard." });
    } catch {
      setNotice({ type: "error", message: "Unable to copy key." });
    }
  };

  const handleDelete = async (keyId: string) => {
    try {
      const response = await fetch(`/api/keys/${keyId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Unable to delete key");
      }
      setKeys((current) => current.filter((item) => item.id !== keyId));
      setNotice({ type: "error", message: "Key deleted successfully." });
      if (visibleKeyId === keyId) setVisibleKeyId(null);
    } catch {
      setNotice({ type: "error", message: "Unable to delete the key." });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-6">
        {sidebarOpen && (
          <aside className="flex w-72 flex-col gap-6 rounded-[30px] border border-border bg-card p-6 text-foreground shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">Dandy</div>
              <button
                type="button"
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-secondary/80"
                onClick={() => setSidebarOpen(false)}
              >
                Hide
              </button>
            </div>
            <nav className="space-y-2 text-sm">
              {navItems.map((item) => {
                const baseClasses =
                  "flex min-h-[44px] w-full items-center gap-3 rounded-2xl border border-border px-4 font-semibold text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
                const highlightClasses = item.highlight
                  ? "border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80";

                const content = (
                  <>
                    {item.icon && <PlayIcon />}
                    <span>{item.label}</span>
                  </>
                );

                if (item.href) {
                  return (
                    <Link key={item.label} href={item.href} className={`${baseClasses} ${highlightClasses}`}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={item.label} className={`${baseClasses} ${highlightClasses}`}>
                    {content}
                  </div>
                );
              })}
            </nav>
            <div className="mt-auto text-xs text-muted-foreground">Tavily MCP</div>
          </aside>
        )}
        <div className="flex-1 space-y-8">
          {!sidebarOpen && (
            <button
              type="button"
              className="ml-auto mb-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary/80"
              onClick={() => setSidebarOpen(true)}
            >
              Show sidebar
            </button>
          )}
          <main className="space-y-8">
            <header className="rounded-[30px] border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p
                    id={headingId}
                    className="text-xs font-semibold uppercase tracking-[0.6em] text-muted-foreground"
                  >
                    Pages / Overview
                  </p>
                  <h1 className="mt-2 text-3xl font-bold">Overview</h1>
                  <p className="text-sm text-muted-foreground">
                    Track plan usage and API keys in one place.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {googleSession?.authenticated ? (
                    <>
                      {googleSession.picture ? (
                        <img
                          src={googleSession.picture}
                          alt={googleSession.name ?? googleSession.email ?? "Google profile"}
                          className="h-9 w-9 rounded-full border border-border object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <p className="text-sm text-muted-foreground">
                        Signed in as {googleSession.name ?? googleSession.email}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          await fetch("/api/auth/logout");
                          setGoogleSession({ authenticated: false });
                          setKeys([]);
                        }}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = "/api/auth/google";
                      }}
                    >
                      Sign in with Google
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {cards.map((item) => (
                  <article
                    key={item.label}
                    className="rounded-2xl border border-border bg-secondary p-4 shadow-sm transition hover:-translate-y-1"
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold">{item.value}</p>
                  </article>
                ))}
              </div>
            </header>

            <section className="rounded-[30px] border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">API Keys</h2>
                  <p className="text-sm text-muted-foreground">Store, rotate, and revoke API access securely.</p>
                </div>
                <Button
                  onClick={() => setIsCreating(true)}
                  disabled={!isAuthenticated}
                  className={`bg-primary text-primary-foreground hover:bg-primary/90 ${!isAuthenticated ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  + Create key
                </Button>
              </div>

              {!isAuthenticated && !sessionLoading ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Sign in with Google to view and manage your API keys.
                </p>
              ) : null}

              {error ? (
                <p className="mt-6 text-sm text-destructive">{error}</p>
              ) : loading ? (
                <p className="mt-6 text-sm text-muted-foreground">Loading keys…</p>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full table-auto divide-y divide-border text-sm text-muted-foreground">
                    <thead className="text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Name</th>
                        <th className="px-4 py-3 text-left font-semibold">Description</th>
                        <th className="px-4 py-3 text-left font-semibold">Key</th>
                        <th className="px-4 py-3 text-left font-semibold">Created</th>
                        <th className="px-4 py-3 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-foreground">
                      {keys.map((key) => (
                        <tr
                          key={key.id}
                          className="hover:bg-white/5"
                          onClick={() => handleOpenEdit(key)}
                          tabIndex={0}
                          role="button"
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              handleOpenEdit(key);
                            }
                          }}
                        >
                          <td className="px-4 py-3 font-semibold">{key.name}</td>
                          <td className="px-4 py-3">{key.description ?? "—"}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-200">
                            {visibleKeyId === key.id ? key.key : formatKey(key.key)}
                          </td>
                          <td className="px-4 py-3">{formatDate(key.createdAt)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/10 text-slate-200 transition hover:border-white hover:bg-white/20"
                                aria-label={visibleKeyId === key.id ? "Hide key" : "View key"}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setVisibleKeyId((prev) => (prev === key.id ? null : key.id));
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                      visibleKeyId === key.id
                                        ? "M15 12H9m4 0c0 1.104-.9 2-2 2m0-4c1.1 0 2 .896 2 2m4 6l2 2m-8-10L5 5m14 0-2 2"
                                        : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    }
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleCopyKey(key);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/10 text-slate-200 transition hover:border-white hover:bg-white/20"
                                aria-label="Copy key"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h6l6 6v6a2 2 0 01-2 2h-2" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8h6l-6 6" />
                                </svg>
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleOpenEdit(key);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/10 text-slate-200 transition hover:border-white hover:bg-white/20"
                                aria-label="Edit key"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 20h4.586L20.242 8.343a1 1 0 000-1.415L16.657 3A1 1 0 0015.242 3L4 14.243V20z" />
                                </svg>
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDelete(key.id);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/10 text-slate-200 transition hover:border-white hover:bg-white/20"
                                aria-label="Delete key"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {keys.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-300">
                            No keys found yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {notice && (
        <div
          className={`fixed top-6 inset-x-0 z-50 mx-auto max-w-[320px] rounded-2xl px-4 py-3 text-sm font-semibold shadow-2xl ${
            notice.type === "success"
              ? "bg-emerald-500/90 text-white"
              : "bg-rose-500/90 text-white"
          }`}
        >
          {notice.message}
        </div>
      )}


      {editingKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-xl space-y-6 rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Edit API key</p>
                <h3 className="text-2xl font-semibold">Update key details</h3>
              </div>
              <button
                type="button"
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                onClick={handleCloseEdit}
              >
                Close
              </button>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-500">
                Key name
                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-slate-500">
                Description
                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
                onClick={handleCloseEdit}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="rounded-full bg-gradient-to-r from-cyan-500 to-rose-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:opacity-90 disabled:opacity-60"
              >
                {savingEdit ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4">
          <div className="w-full max-w-xl space-y-6 rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Create API key</p>
                <h3 className="text-2xl font-semibold">New key details</h3>
              </div>
              <button
                type="button"
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                onClick={() => setIsCreating(false)}
              >
                Close
              </button>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-500">
                Key name
                <input
                  value={createName}
                  onChange={(event) => setCreateName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-slate-500">
                Description
                <textarea
                  value={createDescription}
                  onChange={(event) => setCreateDescription(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateKey}
                disabled={creatingKey}
                className="rounded-full bg-gradient-to-r from-cyan-500 to-rose-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:opacity-90 disabled:opacity-60"
              >
                {creatingKey ? "Creating..." : "Create key"}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </main>
  );
}

