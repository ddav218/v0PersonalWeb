"use client";

import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { useProjects } from "@/hooks/use-portfolio-data";

export function ProjectsSection() {
  const { projects } = useProjects();

  return (
    <section id="projects" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase">
            Coding Projects
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Things I have built
          </h3>
          <p className="text-muted-foreground max-w-md">
            A selection of recent projects showcasing my development skills and
            problem-solving approach.
          </p>
        </div>

        {/* Project cards */}
        <div className="flex flex-col gap-16">
          {projects.map((project, index) => (
            <div
              key={project.id || project.title}
              className={`group grid lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`relative rounded-xl overflow-hidden border border-border aspect-video ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                {project.image && project.image.startsWith("data:") ? (
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={`Screenshot of ${project.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={`Screenshot of ${project.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div
                className={`flex flex-col gap-4 ${
                  index % 2 === 1 ? "lg:order-1 lg:text-right lg:items-end" : ""
                }`}
              >
                <span className="text-xs font-mono text-primary tracking-widest uppercase">
                  Featured Project
                </span>
                <h4 className="text-2xl font-bold text-foreground">
                  {project.title}
                </h4>
                <div className="rounded-xl bg-card border border-border p-6">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {project.description}
                  </p>
                </div>
                <div
                  className={`flex flex-wrap gap-2 ${
                    index % 2 === 1 ? "lg:justify-end" : ""
                  }`}
                >
                  {project.tags &&
                    project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <div
                  className={`flex items-center gap-4 pt-2 ${
                    index % 2 === 1 ? "lg:justify-end" : ""
                  }`}
                >
                  {project.repoUrl && project.repoUrl !== "#" && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`GitHub repository for ${project.title}`}
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`Live demo of ${project.title}`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
