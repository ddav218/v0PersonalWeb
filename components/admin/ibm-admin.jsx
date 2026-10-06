"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCredentials } from "@/hooks/use-portfolio-data";
import { CredentialsManager } from "./credentials-manager";
import { IbmProjectsManager } from "./ibm-projects-manager";
import { LearningTimeline } from "@/components/ibm/learning-timeline";

const SECTIONS = [
  { id: "credentials", label: "Credentials" },
  { id: "projects", label: "Clients & Projects" },
  { id: "timeline", label: "Learning Timeline" },
];

function TimelinePanel() {
  const { credentials, isLoading } = useCredentials();
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (!credentials.length) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Add credentials to build your learning timeline.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Generated from the issue dates of your credentials. Visible only in the dashboard.
      </p>
      <LearningTimeline credentials={credentials} />
    </div>
  );
}

export function IbmAdmin() {
  const [section, setSection] = useState("credentials");

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="IBM sections" className="flex w-fit flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={section === s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              section === s.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === "credentials" && <CredentialsManager />}
      {section === "projects" && <IbmProjectsManager />}
      {section === "timeline" && <TimelinePanel />}
    </div>
  );
}
