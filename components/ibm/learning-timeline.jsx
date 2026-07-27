"use client";

import { useMemo } from "react";
import { Award, GraduationCap } from "lucide-react";

function formatMonth(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short" });
}

export function LearningTimeline({ credentials }) {
  const grouped = useMemo(() => {
    const byYear = new Map();
    for (const c of credentials) {
      const year = c.issueDate ? new Date(c.issueDate).getFullYear() : null;
      const key = Number.isNaN(year) || !year ? "Undated" : year;
      if (!byYear.has(key)) byYear.set(key, []);
      byYear.get(key).push(c);
    }
    // Sort years descending, keep "Undated" last
    return Array.from(byYear.entries())
      .sort((a, b) => {
        if (a[0] === "Undated") return 1;
        if (b[0] === "Undated") return -1;
        return b[0] - a[0];
      })
      .map(([year, items]) => [
        year,
        items.sort((x, y) => new Date(y.issueDate) - new Date(x.issueDate)),
      ]);
  }, [credentials]);

  if (!credentials.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <div className="mb-8 flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Learning Timeline</h3>
      </div>

      <div className="relative">
        {/* vertical rail */}
        <div className="absolute bottom-2 left-[76px] top-2 w-px bg-border md:left-[92px]" />

        <div className="flex flex-col gap-8">
          {grouped.map(([year, items]) => (
            <div key={year} className="flex gap-5 md:gap-7">
              <div className="flex w-[60px] shrink-0 flex-col items-end pt-0.5 md:w-[76px]">
                <span className="font-mono text-lg font-bold text-primary">{year}</span>
                <span className="text-xs text-muted-foreground">
                  {items.length} earned
                </span>
              </div>

              {/* node */}
              <div className="relative flex shrink-0 items-start pt-1">
                <span className="z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              </div>

              <ul className="flex flex-1 flex-col gap-3 pb-2">
                {items.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary">
                      {c.badgeImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.badgeImage || "/placeholder.svg"}
                          alt=""
                          className="h-full w-full object-contain"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <Award className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm font-medium leading-snug text-foreground">
                        {c.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {c.issuer}
                        {c.issueDate ? ` · ${formatMonth(c.issueDate)}` : ""}
                      </span>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      {c.provider}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
