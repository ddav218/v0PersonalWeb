"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CredentialCard } from "./credential-card";
import { CredentialDialog } from "./credential-dialog";

export function CredentialsExplorer({ credentials }) {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("All");
  const [level, setLevel] = useState("All");
  const [activeSkills, setActiveSkills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const providers = useMemo(() => {
    const set = new Set(credentials.map((c) => c.provider).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [credentials]);

  const levels = useMemo(() => {
    const set = new Set(credentials.map((c) => c.level).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [credentials]);

  const allSkills = useMemo(() => {
    const counts = new Map();
    for (const c of credentials) {
      for (const s of [...(c.skills || []), ...(c.tags || [])]) {
        const key = s.trim();
        if (!key) continue;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .slice(0, 18);
  }, [credentials]);

  function toggleSkill(skill) {
    setActiveSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return credentials.filter((c) => {
      if (provider !== "All" && c.provider !== provider) return false;
      if (level !== "All" && c.level !== level) return false;
      if (activeSkills.length) {
        const bag = [...(c.skills || []), ...(c.tags || [])];
        const hasAll = activeSkills.every((s) => bag.includes(s));
        if (!hasAll) return false;
      }
      if (q) {
        const haystack = [
          c.title,
          c.issuer,
          c.provider,
          ...(c.skills || []),
          ...(c.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [credentials, query, provider, level, activeSkills]);

  const hasFilters =
    query || provider !== "All" || level !== "All" || activeSkills.length > 0;

  function clearAll() {
    setQuery("");
    setProvider("All");
    setLevel("All");
    setActiveSkills([]);
  }

  function openCredential(c) {
    setSelected(c);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter bar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search credentials, issuers, or skills..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter by provider"
            >
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p === "All" ? "All Providers" : p}
                </option>
              ))}
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter by level"
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l === "All" ? "All Levels" : l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {allSkills.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter by skill
            </span>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => {
                const active = activeSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            {credentials.length} credentials
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CredentialCard
              key={c.id}
              credential={c}
              onClick={() => openCredential(c)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No credentials match your filters.
          </p>
        </div>
      )}

      <CredentialDialog
        credential={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
