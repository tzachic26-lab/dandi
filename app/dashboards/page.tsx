import Link from "next/link";
import {
  AlertEntry,
  RecentDashboard,
  StatCard,
  dashboardStatusBadgeClasses,
  getAlerts,
  getRecentDashboards,
  getStatCards,
  statStatusBadgeClasses,
} from "./data";

type IconProps = {
  className?: string;
};

const EyeIcon = ({ className = "" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M1.5 12s4.5-7 10.5-7S22.5 12 22.5 12s-4.5 7-10.5 7S1.5 12 1.5 12Z" />
    <circle cx={12} cy={12} r={3.2} />
  </svg>
);

const ArrowRightIcon = ({ className = "" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const handleViewDashboard = (title: string): void => {
  console.info(`View dashboard: ${title}`);
};

const handleAlertAction = (label: string): void => {
  console.info(`Alert action: ${label}`);
};

const StatusBadge = ({ status }: { status: StatCard["status"] }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${statStatusBadgeClasses[status]}`}
  >
    {status}
  </span>
);

const DashboardStatusBadge = ({
  status,
}: {
  status: RecentDashboard["status"];
}) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${dashboardStatusBadgeClasses[status]}`}
  >
    {status}
  </span>
);

const StatCardTile = ({ card }: { card: StatCard }) => (
  <article className="flex flex-col justify-between rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-indigo-900/80 via-blue-950/60 to-purple-950/60 p-6 shadow-[0_25px_45px_rgba(79,70,229,0.35)]">
    <header className="flex items-center justify-between">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
        {card.title}
      </p>
      <StatusBadge status={card.status} />
    </header>
    <div className="mt-4">
      <p className="text-4xl font-semibold text-white">{card.value}</p>
      <p className="text-sm text-cyan-300">{card.change}</p>
      <p className="mt-2 text-sm text-zinc-400">{card.caption}</p>
    </div>
  </article>
);

const StatsSection = () => {
  const cards = getStatCards();
  if (!cards.length) {
    return null;
  }

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {cards.map((card) => (
        <StatCardTile key={card.title} card={card} />
      ))}
    </section>
  );
};

const HeroSection = () => (
  <header className="rounded-3xl border border-purple-500/40 bg-gradient-to-br from-indigo-950/70 via-blue-950/60 to-purple-900/70 p-8 shadow-2xl shadow-purple-950/40 backdrop-blur">
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
        Dashboards console
      </p>
      <h1 className="text-3xl font-semibold">Your live analytics suite</h1>
      <p className="max-w-3xl text-base text-zinc-300">
        Track usage, monitor health, and keep your teams in sync with every
        dashboard that relies on vaulted API keys. Actions live together with the
        key management hub for quick context switching.
      </p>
      <div className="mt-3 h-px w-28 bg-gradient-to-r from-cyan-400/80 via-indigo-400/50 to-purple-500/60" />
    </div>
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <Link
        href="/"
        aria-label="Back to API key hub"
        className="rounded-full border border-transparent bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-purple-500/40 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400/80 hover:to-purple-400/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
      >
        Back to API key hub
      </Link>
      <span className="text-sm text-zinc-400">
        Status at a glance · Updates every 5 minutes
      </span>
    </div>
  </header>
);

const RecentDashboardCard = ({ entry }: { entry: RecentDashboard }) => (
  <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-indigo-950/40 to-purple-950/70 p-4 shadow-[0_12px_40px_rgba(79,70,229,0.15)]">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold">{entry.title}</h3>
        <p className="text-sm text-zinc-400">{entry.lastUpdated}</p>
      </div>
      <DashboardStatusBadge status={entry.status} />
    </div>
    <div className="mt-3 flex items-center justify-between text-sm text-zinc-400">
      <p>{entry.users} viewers</p>
      <button
        type="button"
        aria-label={`View ${entry.title}`}
        onClick={() => handleViewDashboard(entry.title)}
        className="group rounded-full border border-cyan-500/30 bg-indigo-900/60 p-3 text-cyan-200 transition hover:border-cyan-300 hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
      >
        <EyeIcon className="h-5 w-5 transition group-hover:text-white" />
      </button>
    </div>
  </article>
);

const RecentDashboardsSection = () => {
  const dashboards = getRecentDashboards();
  if (!dashboards.length) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent dashboards</h2>
        <span className="text-sm text-zinc-400">Last 7 days</span>
      </div>
      <div className="mt-6 space-y-4">
        {dashboards.map((entry) => (
          <RecentDashboardCard key={entry.title} entry={entry} />
        ))}
      </div>
    </div>
  );
};

const AlertCard = ({ alert }: { alert: AlertEntry }) => (
  <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-indigo-950/50 to-purple-950/70 p-4 shadow-[0_12px_40px_rgba(79,70,229,0.2)]">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
      <p className="text-sm text-zinc-400">{alert.description}</p>
    </div>
    <button
      type="button"
      aria-label={alert.actionLabel}
      onClick={() => handleAlertAction(alert.actionLabel)}
      className="mt-3 inline-flex items-center justify-center rounded-full border border-cyan-500/40 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 p-3 text-cyan-200 transition hover:border-cyan-300 hover:from-cyan-400/60 hover:to-purple-400/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
    >
      <ArrowRightIcon className="h-4 w-4" />
      <span className="sr-only">{alert.actionLabel}</span>
    </button>
  </article>
);

const AlertsSection = () => {
  const alertEntries = getAlerts();
  if (!alertEntries.length) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Security & alerts</h2>
        <span className="text-sm text-zinc-400">Prioritized</span>
      </div>
      <div className="mt-6 space-y-4">
        {alertEntries.map((alert) => (
          <AlertCard key={alert.title} alert={alert} />
        ))}
      </div>
    </div>
  );
};

const DashboardsPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 px-4 py-12 text-white sm:px-6 lg:px-10">
    <main className="mx-auto flex max-w-5xl flex-col gap-10">
      <HeroSection />
      <StatsSection />
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <RecentDashboardsSection />
        <AlertsSection />
      </section>
    </main>
  </div>
);

export default DashboardsPage;

