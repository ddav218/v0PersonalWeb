"use client";

import Image from "next/image";
import { ExternalLink, Github, BriefcaseBusiness } from "lucide-react";
import { useProjects } from "@/hooks/use-portfolio-data";

function ProjectCard({ project }) {
  return (
    <article className="group grid gap-6 rounded-xl border border-border bg-card p-5 md:grid-cols-[180px_1fr]">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-secondary md:aspect-square">
        {project.image?.startsWith("data:") ? (
          <img src={project.image} alt={`Screenshot of ${project.title}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <Image src={project.image || "/placeholder.svg"} alt={`Screenshot of ${project.title}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-mono uppercase tracking-widest text-primary">{project.category === "billable" ? "Client delivery" : "Practice & contribution"}</span>
        <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(project.tags) ? project.tags : []).filter((tag) => !["billable", "non-billable"].includes(tag.toLowerCase())).map((tag) => <span key={tag} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{tag}</span>)}
        </div>
        <div className="mt-auto flex items-center gap-4 pt-2">
          {project.repoUrl && project.repoUrl !== "#" && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`GitHub repository for ${project.title}`} className="text-muted-foreground hover:text-primary"><Github className="h-4 w-4" /></a>}
          {project.liveUrl && project.liveUrl !== "#" && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Live project for ${project.title}`} className="text-muted-foreground hover:text-primary"><ExternalLink className="h-4 w-4" /></a>}
        </div>
      </div>
    </article>
  );
}

function ProjectGroup({ title, description, projects }) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center gap-2 text-primary"><BriefcaseBusiness className="h-4 w-4" /><span className="text-xs font-mono uppercase tracking-widest">Clients & Projects</span></div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {projects.length ? <div className="grid gap-5 lg:grid-cols-2">{projects.map((project) => <ProjectCard key={project.id || project.title} project={project} />)}</div> : <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">Projects in this category will appear here from the dashboard.</div>}
    </section>
  );
}

export function IbmProjects() {
  const { projects } = useProjects();
  const normalized = projects.map((project) => ({ ...project, category: project.category || (project.tags || []).find((tag) => ["billable", "non-billable"].includes(tag.toLowerCase())) || "non-billable" }));
  return <div className="flex flex-col gap-14"><ProjectGroup title="Billables" description="Client-facing delivery work, integration engagements, and production outcomes." projects={normalized.filter((project) => project.category === "billable")} /><ProjectGroup title="Non-billables" description="Internal initiatives, experiments, community work, and capability building." projects={normalized.filter((project) => project.category !== "billable")} /></div>;
}
