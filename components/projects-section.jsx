"use client";

import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Analytics Dashboard",
    description:
      "A real-time data visualization dashboard built with React and D3.js. Features interactive charts, custom widgets, and a dark-themed interface.",
    image: "/images/project-1.jpg",
    tags: ["React", "TypeScript", "D3.js", "Tailwind CSS"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce application with product management, cart system, and payment integration. Optimized for mobile-first experiences.",
    image: "/images/project-2.jpg",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    title: "Social Connect App",
    description:
      "A social networking platform with real-time messaging, user profiles, and content feeds. Built for scalability and performance.",
    image: "/images/project-3.jpg",
    tags: ["React", "Firebase", "WebSocket", "Material UI"],
    liveUrl: "#",
    repoUrl: "#",
  },
];

export function ProjectsSection() {
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
              key={project.title}
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
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={`Screenshot of ${project.title}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
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
                  {project.tags.map((tag) => (
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
                  <a
                    href={project.repoUrl}
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`GitHub repository for ${project.title}`}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href={project.liveUrl}
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`Live demo of ${project.title}`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
