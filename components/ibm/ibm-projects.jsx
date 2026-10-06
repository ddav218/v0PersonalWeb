"use client";

import { ExternalLink, Github, BriefcaseBusiness } from "lucide-react";
import { useIbmProjects } from "@/hooks/use-portfolio-data";

const cn = (...classes) => classes.filter(Boolean).join(" ");

function formatRange(start, end) {
  const fmt = (v) =>
    new Date(`${v}T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (!start && !end) return "";
  if (start && !end) return `${fmt(start)} – Present`;
  if (!start) return fmt(end);
  return `${fmt(start)} – ${fmt(end)}`;
}

function ProjectRow({ project, reversed }) {
  const range = formatRange(project.startDate, project.endDate);
  const eyebrow =
    project.client || (project.category === "billable" ? "Client Delivery" : "Internal Initiative");

  return (
    <article className="group grid items-center gap-8 lg:grid-cols-2">
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl border border-border bg-secondary",
          reversed && "lg:order-2",
        )}
      >
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`Image for ${project.title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BriefcaseBusiness className="h-10 w-10 text-primary/40" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className={cn("flex flex-col gap-4", reversed && "lg:order-1 lg:items-end lg:text-right")}>
        <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", reversed && "lg:justify-end")}>
          <span className="text-xs font-mono uppercase tracking-widest text-primary">{eyebrow}</span>
          {range && <span className="text-xs font-mono text-muted-foreground">{range}</span>}
        </div>
        <h4 className="text-2xl font-bold text-foreground text-balance">{project.title}</h4>
        {project.role && <p className="text-sm font-medium text-foreground/80">{project.role}</p>}
        {project.description && (
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{project.description}</p>
          </div>
        )}
        {project.tags.length > 0 && (
          <div className={cn("flex flex-wrap gap-x-4 gap-y-2", reversed && "lg:justify-end")}>
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        {(project.repoUrl || project.liveUrl) && (
          <div className={cn("flex items-center gap-4 pt-2", reversed && "lg:justify-end")}>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Repository for ${project.title}`}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title}`}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function ProjectGroup({ label, title, description, projects, isLoading }) {
  return (
    <section className="flex flex-col">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px w-12 bg-primary" />
        <h2 className="text-sm font-mono uppercase tracking-widest text-primary">{label}</h2>
      </div>

      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="text-3xl font-bold text-foreground text-balance sm:text-4xl">{title}</h3>
        <p className="max-w-md text-muted-foreground text-pretty">{description}</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-16">
          {[0, 1].map((i) => (
            <div key={i} className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-video animate-pulse rounded-xl border border-border bg-card" />
              <div className="h-48 animate-pulse rounded-xl border border-border bg-card" />
            </div>
          ))}
        </div>
      ) : projects.length ? (
        <div className="flex flex-col gap-16">
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} reversed={index % 2 === 1} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Projects in this category will appear here once added from the dashboard.
        </div>
      )}
    </section>
  );
}

export function IbmProjects() {
  const { ibmProjects, isLoading } = useIbmProjects();
  return (
    <div className="flex flex-col gap-24">
      <ProjectGroup
        label="Clients & Projects — Billables"
        title="Client delivery"
        description="Client-facing delivery work, integration engagements, and production outcomes."
        projects={ibmProjects.filter((p) => p.category === "billable")}
        isLoading={isLoading}
      />
      <ProjectGroup
        label="Clients & Projects — Non-billables"
        title="Internal initiatives"
        description="Internal initiatives, experiments, community work, and capability building."
        projects={ibmProjects.filter((p) => p.category === "non-billable")}
        isLoading={isLoading}
      />
    </div>
  );
}
