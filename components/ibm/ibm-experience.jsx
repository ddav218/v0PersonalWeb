"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BrainCircuit,
  Github,
  Layers,
  Linkedin,
  Mail,
  Route,
  Workflow,
} from "lucide-react";
import { useCredentials, useSkillGraph, useSettings } from "@/hooks/use-portfolio-data";
import { SkillGraph } from "./skill-graph";
import { CredentialsExplorer } from "./credentials-explorer";
import { LearningTimeline } from "./learning-timeline";
import { IbmContact } from "./ibm-contact";
import { IbmProjects } from "./ibm-projects";

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <div className="rounded-md bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-none text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export function IbmExperience() {
  const { credentials, isLoading } = useCredentials();
  const { graph } = useSkillGraph();
  const { settings } = useSettings();

  const stats = useMemo(() => {
    const providers = new Set(credentials.map((c) => c.provider).filter(Boolean));
    const skills = new Set();
    const paths = new Set();
    credentials.forEach((c) => {
      (c.skills || []).forEach((s) => skills.add(s));
      (c.tags || []).forEach((t) => paths.add(t));
    });
    return {
      total: credentials.length,
      providers: providers.size,
      skills: skills.size,
      paths: paths.size,
    };
  }, [credentials]);

  const skillCounts = useMemo(() => {
    const counts = new Map();
    credentials.forEach((c) => {
      new Set(Array.isArray(c.skills) ? c.skills : []).forEach((s) =>
        counts.set(s, (counts.get(s) || 0) + 1),
      );
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [credentials]);

  const profileHeadline = settings?.ibm_profile_headline || "Oracle Applications Operations: Integration Specialist";
  const profileIntro = settings?.ibm_profile_intro || "I'm an Oracle Middleware Developer specializing in enterprise integrations — designing and building the connective tissue between mission-critical systems.";
  const values = settings?.ibm_values || "Clarity in complexity, ownership in delivery, and continuous learning through measurable outcomes.";

  return (
    <div className="ibm-theme min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/darrius-davidson.png"
              alt="Darrius J. Davidson"
              className="h-8 w-8 rounded-full object-cover object-top ring-1 ring-border"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Darrius J. Davidson
              </span>
              <span className="text-[11px] text-muted-foreground">
                Credential Intelligence
              </span>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero / professional summary */}
        <section className="flex flex-col gap-8">
          <div className="grid items-center gap-8 md:grid-cols-[220px_1fr]">
            {/* Photo */}
            <div className="mx-auto w-full max-w-[220px]">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                <img
                  src="/images/darrius-davidson.png"
                  alt="Portrait of Darrius J. Davidson"
                  className="aspect-square w-full object-cover object-top"
                />
              </div>
            </div>

            {/* Intro */}
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <BadgeCheck className="h-3.5 w-3.5" />
                AI-verified digital credentials
              </span>
              <div className="flex flex-col gap-1">
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  Darrius J. Davidson
                </h1>
                <p className="text-lg font-semibold text-primary md:text-xl">
                  {profileHeadline}
                </p>
              </div>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
                {profileIntro}
              </p>
            </div>
          </div>
        </section>

        {/* Values and credential intelligence */}
        <section className="mt-14">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Values</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{values}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Layers} value={stats.total} label="Credentials" />
            <Stat icon={Workflow} value={stats.providers} label="Providers" />
            <Stat icon={BrainCircuit} value={stats.skills} label="Skills mapped" />
            <Stat icon={Route} value={stats.paths} label="Learning paths" />
          </div>
        </section>

        {/* Credential Intelligence */}
        <section
          id="credential-intelligence"
          aria-labelledby="credential-intelligence-title"
          className="mt-16 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="flex flex-col gap-2 border-b border-border bg-primary/5 px-6 py-6 md:px-8">
            <span className="inline-flex w-fit items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
              <BrainCircuit className="h-3.5 w-3.5" />
              Credential Intelligence
            </span>
            <h2
              id="credential-intelligence-title"
              className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl"
            >
              Verified skills, credentials, and capability map
            </h2>
            <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
              Every credential uploaded in the dashboard feeds the skills index, the
              credential wallet, and the AI skill graph below.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {/* Skills */}
            <div className="flex flex-col gap-5 px-6 py-8 md:px-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">Skills</h3>
                <p className="text-sm text-muted-foreground">
                  Earned skills from your digital credentials, ranked by how many credentials support each one.
                </p>
              </div>
              {skillCounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Add skills to each credential in the dashboard to populate this list.
                </p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {skillCounts.map(([skill, count]) => (
                    <li
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                    >
                      {skill}
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        {count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Credential wallet */}
            <div className="flex flex-col gap-5 px-6 py-8 md:px-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Credential Wallet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Every certification uploaded in the dashboard, searchable and filterable.
                </p>
              </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-xl border border-border bg-card"
                />
              ))}
            </div>
          ) : credentials.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <BrainCircuit className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No credentials yet. Connect a Credly profile or add credentials from the
                admin dashboard to populate this page.
              </p>
            </div>
          ) : (
            <CredentialsExplorer credentials={credentials} />
          )}
            </div>

            {/* AI Skill Graph */}
            <div className="flex flex-col gap-5 px-6 py-8 md:px-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  AI Skill Graph
                </h3>
                <p className="text-sm text-muted-foreground">
                  Built from the skills attached to each digital credential.
                </p>
              </div>
              <SkillGraph credentials={credentials} graph={graph} />
            </div>

            {/* Learning timeline */}
            {credentials.length > 0 && (
              <div className="px-6 py-8 md:px-8">
                <LearningTimeline credentials={credentials} />
              </div>
            )}
          </div>
        </section>

        {/* Clients & Projects */}
        <section className="mt-16">
          <IbmProjects />
        </section>
      </main>

      {/* Contact — "Let's work together" */}
      <IbmContact />

      {/* Footer (same format as main site, IBM theme) */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <Link
                href="/ibm"
                className="font-mono text-lg font-bold tracking-tight text-foreground"
              >
                <span className="text-primary">{"{"}</span>
                Darrius J. Davidson
                <span className="text-primary">{"}"}</span>
              </Link>
              <p className="text-xs text-muted-foreground">
                {"Built with Next.js & Tailwind CSS"}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <a
                href="https://github.com/ddav218"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/darrius-davidson-b9a63a24a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&to=ddavidson03@ibm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              {"© 2026 Darrius Davidson | All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
