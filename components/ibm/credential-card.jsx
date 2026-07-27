"use client";

import { Award, BadgeCheck, CalendarClock } from "lucide-react";

const LEVEL_STYLES = {
  Foundational: "bg-secondary text-secondary-foreground",
  Intermediate: "bg-primary/10 text-primary",
  Advanced: "bg-primary/15 text-primary",
  Specialist: "bg-primary text-primary-foreground",
};

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function CredentialCard({ credential, onClick }) {
  const issued = formatDate(credential.issueDate);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary">
          {credential.badgeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={credential.badgeImage || "/placeholder.svg"}
              alt={`${credential.title} badge`}
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Award className="h-7 w-7 text-primary" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="line-clamp-2 font-semibold leading-snug text-foreground">
            {credential.title}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{credential.issuer}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {credential.provider}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                LEVEL_STYLES[credential.level] || LEVEL_STYLES.Foundational
              }`}
            >
              {credential.level}
            </span>
          </div>
        </div>
      </div>

      {credential.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {credential.skills.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
          {credential.skills.length > 4 && (
            <span className="rounded-md px-2 py-0.5 text-xs text-muted-foreground">
              +{credential.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" />
          {issued || "Date pending"}
        </span>
        {credential.verified && (
          <span className="flex items-center gap-1 text-primary">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
      </div>
    </button>
  );
}
