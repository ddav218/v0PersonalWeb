"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  const headingRef = useRef(null);

  useEffect(() => {
    const el = headingRef.current;
    if (el) {
      el.classList.add("animate-fade-in-up");
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(43 74% 49%) 1px, transparent 1px), linear-gradient(90deg, hsl(43 74% 49%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow effect */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-sm font-mono text-primary tracking-widest uppercase">
                Welcome to my portfolio
              </span>
            </div>

            <h1
              ref={headingRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground opacity-0"
            >
              I code
              <span className="text-primary"> cool </span>
              websites
              <br />
              <span className="text-muted-foreground text-3xl sm:text-4xl lg:text-5xl">
                {"& design stunning visuals"}
              </span>
            </h1>

            <p className="max-w-lg text-muted-foreground leading-relaxed text-lg">
              A creative developer and designer who builds modern web
              experiences and crafts compelling visual identities. Turning ideas
              into polished digital products.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <a
                href="#projects"
                className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                View My Work
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Get in Touch
              </a>
            </div>

            <div className="flex items-center gap-5 pt-6">
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
                href="https://mail.google.com/mail/?view=cm&to=ddavidson1230@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden border-2 border-border">
              <Image
                src="/images/hero-portrait.jpg"
                alt="Portrait photo"
                fill
                className="object-cover"
                priority
              />
              {/* Gold accent overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-3 -right-3 w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl border-2 border-primary/30 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
