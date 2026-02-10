import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a
              href="#"
              className="font-mono text-lg font-bold tracking-tight text-foreground"
            >
              <span className="text-primary">{"{"}</span>
              Darrius J. Davidson
              <span className="text-primary">{"}"}</span>
            </a>
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
              href="#"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
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

          <p className="text-xs text-muted-foreground">
            {"© 2026 All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
