import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import DashboardsPage from "./page";
import {
  createRecentDashboard,
  deleteRecentDashboard,
  getAlerts,
  getRecentDashboards,
  getStatCards,
  resetRecentDashboards,
  updateRecentDashboard,
} from "./data";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const renderPage = () => render(<DashboardsPage />);

beforeEach(() => {
  resetRecentDashboards();
});

describe("Dashboards page content", () => {
  it("renders the hero copy, stats, and link", () => {
    renderPage();

    expect(screen.getByText("Dashboards console")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Back to API key hub/i })
    ).toBeInTheDocument();

    getStatCards().forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.value)).toBeInTheDocument();
      expect(screen.getByText(card.change)).toBeInTheDocument();
      expect(screen.getByText(card.caption)).toBeInTheDocument();
    });
  });

  it("shows recent dashboards with action buttons", () => {
    renderPage();

    getRecentDashboards().forEach((entry) => {
      expect(screen.getByText(entry.title)).toBeInTheDocument();
      expect(screen.getByText(`${entry.users} viewers`)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: `View ${entry.title}` })
      ).toBeInTheDocument();
    });
  });

  it("renders security alerts and their actions", () => {
    renderPage();

    getAlerts().forEach((alert) => {
      expect(screen.getByText(alert.title)).toBeInTheDocument();
      expect(screen.getByText(alert.description)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: alert.actionLabel })
      ).toBeInTheDocument();
    });
  });
});

describe("recent dashboard CRUD helpers", () => {
  it("can create a dashboard", () => {
    const newDashboard = {
      title: "New test dashboard",
      status: "live" as const,
      lastUpdated: "Updated now",
      users: 1,
    };

    const updatedList = createRecentDashboard(newDashboard);
    expect(updatedList).toContainEqual(newDashboard);
    expect(getRecentDashboards()).toContainEqual(newDashboard);
  });

  it("updates existing dashboard details", () => {
    const result = updateRecentDashboard("Executive Overview", {
      users: 99,
    });

    expect(result).not.toBeNull();
    expect(result?.users).toBe(99);
    expect(getRecentDashboards().some((entry) => entry.users === 99)).toBe(true);
  });

  it("returns null when updating a missing dashboard", () => {
    const result = updateRecentDashboard("Does not exist", { users: 5 });
    expect(result).toBeNull();
  });

  it("deletes the matching dashboard and ignores missing entries", () => {
    const entryToRemove = "Payments Health";
    const removed = deleteRecentDashboard(entryToRemove);
    expect(removed).toBe(true);
    expect(
      getRecentDashboards().some((entry) => entry.title === entryToRemove)
    ).toBe(false);

    const missingRemoval = deleteRecentDashboard("Unknown");
    expect(missingRemoval).toBe(false);
  });
});

