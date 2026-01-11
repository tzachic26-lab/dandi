export type StatCard = {
  title: string;
  value: string;
  change: string;
  caption: string;
  status: "healthy" | "watch" | "attention";
};

export type RecentDashboard = {
  title: string;
  status: "live" | "paused" | "archived";
  lastUpdated: string;
  users: number;
};

export type AlertEntry = {
  title: string;
  description: string;
  actionLabel: string;
};

const statCards: StatCard[] = [
  {
    title: "Active dashboards",
    value: "24",
    change: "+2 this week",
    caption: "Steady growth across teams",
    status: "healthy",
  },
  {
    title: "API calls / min",
    value: "1.4k",
    change: "–120 vs yesterday",
    caption: "Lower traffic, normal pattern",
    status: "watch",
  },
  {
    title: "Error rate",
    value: "0.4%",
    change: "+0.2% in last 24h",
    caption: "Investigate recent spikes",
    status: "attention",
  },
  {
    title: "New integrations",
    value: "6",
    change: "+1 new connector",
    caption: "Fresh partners onboarding",
    status: "healthy",
  },
];

const initialRecentDashboards: RecentDashboard[] = [
  {
    title: "Executive Overview",
    status: "live",
    lastUpdated: "Updated 12m ago",
    users: 14,
  },
  {
    title: "Payments Health",
    status: "paused",
    lastUpdated: "Updated 2h ago",
    users: 8,
  },
  {
    title: "Inventory Signals",
    status: "live",
    lastUpdated: "Updated 1h ago",
    users: 11,
  },
  {
    title: "Archived: Q3 Retrospective",
    status: "archived",
    lastUpdated: "Updated 4d ago",
    users: 3,
  },
];

let recentDashboards: RecentDashboard[] = initialRecentDashboards.map((entry) => ({
  ...entry,
}));

const alerts: AlertEntry[] = [
  {
    title: "Rotate stale keys",
    description: "Several dashboards still rely on keys older than 90 days.",
    actionLabel: "Review keys",
  },
  {
    title: "High error spike",
    description: "Payments Health triggered 13% more 500s on POST /orders.",
    actionLabel: "Inspect logs",
  },
  {
    title: "New team request",
    description: "Product Analytics requested access to the Executive Overview dashboard.",
    actionLabel: "Approve request",
  },
];

export const statStatusBadgeClasses: Record<StatCard["status"], string> = {
  healthy: "bg-cyan-400/20 text-cyan-200",
  watch: "bg-violet-500/20 text-violet-200",
  attention: "bg-fuchsia-500/20 text-fuchsia-200",
};

export const dashboardStatusBadgeClasses: Record<RecentDashboard["status"], string> =
  {
    live: "bg-cyan-500/20 text-cyan-200",
    paused: "bg-violet-500/20 text-violet-200",
    archived: "bg-indigo-500/20 text-indigo-200",
  };

export const getStatCards = (): StatCard[] => statCards.map((card) => ({ ...card }));

export const getRecentDashboards = (): RecentDashboard[] =>
  recentDashboards.map((entry) => ({ ...entry }));

export const resetRecentDashboards = (): void => {
  recentDashboards = initialRecentDashboards.map((entry) => ({ ...entry }));
};

export const getAlerts = (): AlertEntry[] => alerts.map((alert) => ({ ...alert }));

export const createRecentDashboard = (
  dashboard: RecentDashboard
): RecentDashboard[] => {
  recentDashboards.push(dashboard);
  return getRecentDashboards();
};

export const updateRecentDashboard = (
  title: string,
  updates: Partial<RecentDashboard>
): RecentDashboard | null => {
  const index = recentDashboards.findIndex((entry) => entry.title === title);
  if (index === -1) {
    return null;
  }

  recentDashboards[index] = { ...recentDashboards[index], ...updates };
  return { ...recentDashboards[index] };
};

export const deleteRecentDashboard = (title: string): boolean => {
  const index = recentDashboards.findIndex((entry) => entry.title === title);
  if (index === -1) {
    return false;
  }

  recentDashboards.splice(index, 1);
  return true;
};

