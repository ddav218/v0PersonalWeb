"use client";

import { ExternalLink, Github, BriefcaseBusiness } from "lucide-react";
import { useIbmProjects } from "@/hooks/use-portfolio-data";

function formatRange(start, end) {
  const fmt = (v) =>
    new Date(`${v}T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (!start && !end) return "";
  if (start && !end) return `${fmt(start)} – Present`;
  if (!start) return fmt(end);
  return `${fmt(start)} – ${fmt(end)}`;
}

function ProjectCard({ project }) {
  const range = formatRange(project.startDate, project.endDate);
  return (
    <article className="group grid gap-6 rounded-xl border border-border bg-card p-5 md:grid-cols-[180px_1fr]">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-secondary md:aspect-square">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`Image for ${project.title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BriefcaseBusiness className="h-8 w-8 text-primary/40" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-primary">
            {project.client || (project.category === "billable" ? "Client delivery" : "Internal initiative")}
          </span>
          {range && <span className="text-xs text-muted-foreground">{range}</span>}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
        {project.role && <p className="text-sm font-medium text-foreground/80">{project.role}</p>}
        {project.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        )}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        {(project.repoUrl || project.liveUrl) && (
          <div className="mt-auto flex items-center gap-4 pt-2">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Repository for ${project.title}`} className="text-muted-foreground hover:text-primary">
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`} className="text-muted-foreground hover:text-primary">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function ProjectGroup({ title, description, projects, isLoading }) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center gap-2 text-primary">
          <BriefcaseBusiness className="h-4 w-4" />
          <span className="text-xs font-mono uppercase tracking-widest">Clients &amp; Projects</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {isLoading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      ) : projects.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Projects in this category will appear here from the dashboard.
        </div>
      )}
    </section>
  );
}

export function IbmProjects() {
  const { ibmProjects, isLoading } = useIbmProjects();
  return (
    <div className="flex flex-col gap-14">
      <ProjectGroup
        title="Billables"
        description="Client-facing delivery work, integration engagements, and production outcomes."
        projects={ibmProjects.filter((p) => p.category === "billable")}
        isLoading={isLoading}
      />
      <ProjectGroup
        title="Non-billables"
        description="Internal initiatives, experiments, community work, and capability building."
        projects={ibmProjects.filter((p) => p.category === "non-billable")}
        isLoading={isLoading}
      />
    </div>
  );
}
