"use client";

import { Code, Palette, Globe, Zap, Mail } from "lucide-react";
import { useSkills } from "@/hooks/use-portfolio-data";

const skillCards = [
  {
    icon: Code,
    title: "Frontend Development",
    description:
      "Building responsive, accessible interfaces with React, Next.js, and TypeScript.",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description:
      "Creating brand identities, marketing materials, and UI designs using Figma and Adobe Suite.",
  },
  {
    icon: Globe,
    title: "Full-Stack Apps",
    description:
      "Developing end-to-end applications with modern backends, databases, and deployment pipelines.",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Optimizing for speed, SEO, and exceptional user experience across all devices.",
  },
];

const levelColors = {
  Proficient: "border-primary/60 text-primary",
  Intermediate: "border-primary/30 text-muted-foreground",
  Basic: "border-border text-muted-foreground/70",
};

export function AboutSection() {
  const { skills } = useSkills();

  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px w-12 bg-primary" />
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase">
            About Me
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Left: Bio */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Developer by trade. Designer by passion.
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {
                "I'm a multidisciplinary creative who thrives at the intersection of code and design. With years of experience building web applications and crafting visual content, I bring a unique perspective to every project."
              }
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {
                "Whether it's architecting a scalable frontend, designing a brand identity, or building a full-stack application from scratch, I'm driven by the challenge of creating something meaningful and visually compelling."
              }
            </p>

            {/* Email link */}
            <a
              href="https://mail.google.com/mail/?view=cm&to=ddavidson1230@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity w-fit"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm font-mono">ddavidson1230@gmail.com</span>
            </a>

            {/* Programming Languages */}
            <div className="pt-4">
              <p className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">
                Programming Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.programmingLanguages.map((item) => (
                  <span
                    key={item.name}
                    className={`rounded-md bg-secondary px-3 py-1.5 text-xs font-mono border ${levelColors[item.level] || ""}`}
                  >
                    {item.name}
                    <span className="ml-1.5 opacity-60">({item.level})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Digital Media Tools */}
            <div className="pt-2">
              <p className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">
                Digital Media Tools
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.digitalMediaTools.map((item) => (
                  <span
                    key={item.name}
                    className={`rounded-md bg-secondary px-3 py-1.5 text-xs font-mono border ${levelColors[item.level] || ""}`}
                  >
                    {item.name}
                    <span className="ml-1.5 opacity-60">({item.level})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Skill cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {skillCards.map((skill) => (
              <div
                key={skill.title}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:bg-secondary/50"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary/20 transition-colors">
                    <skill.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      {skill.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
