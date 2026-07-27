"use client";

import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { BrainCircuit, Sparkles } from "lucide-react";

const LEVEL_WEIGHT = {
  Foundational: 60,
  Intermediate: 74,
  Advanced: 88,
  Specialist: 96,
};

// Deterministic fallback: build domains from credential tags/skills if the
// AI graph hasn't been generated yet.
function buildFallbackDomains(credentials) {
  const map = new Map();
  for (const c of credentials) {
    const buckets = (c.tags && c.tags.length ? c.tags : c.skills || []).slice(0, 3);
    const weight = LEVEL_WEIGHT[c.level] || 65;
    for (const b of buckets) {
      const key = b.trim();
      if (!key) continue;
      const entry = map.get(key) || { total: 0, count: 0, skills: new Set() };
      entry.total += weight;
      entry.count += 1;
      (c.skills || []).slice(0, 4).forEach((s) => entry.skills.add(s));
      map.set(key, entry);
    }
  }
  return Array.from(map.entries())
    .map(([name, v]) => ({
      name,
      score: Math.min(100, Math.round(v.total / v.count)),
      credentialCount: v.count,
      skills: Array.from(v.skills).slice(0, 6),
    }))
    .sort((a, b) => b.score - a.score || b.credentialCount - a.credentialCount)
    .slice(0, 6);
}

export function SkillGraph({ credentials, graph }) {
  const domains = useMemo(() => {
    if (graph?.domains?.length) return graph.domains;
    return buildFallbackDomains(credentials);
  }, [graph, credentials]);

  const radarData = domains.map((d) => ({
    domain: d.name,
    score: d.score,
  }));

  if (!domains.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <BrainCircuit className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          No skill data yet. Credentials will populate the AI skill graph automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Radar */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-2 flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Skill Domain Radar</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Aggregate proficiency across your strongest professional domains.
        </p>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="domain"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <Radar
                name="Proficiency"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranked bars */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Proficiency Breakdown</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Ranked by credential depth and mastery level.
        </p>
        <ul className="flex flex-col gap-4">
          {domains.map((d) => (
            <li key={d.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{d.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {d.score}%
                  <span className="ml-2 text-muted-foreground/70">
                    {d.credentialCount} cred{d.credentialCount !== 1 ? "s" : ""}
                  </span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${d.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
