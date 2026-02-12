"use client";

import { useState } from "react";
import { Send, MapPin, Mail, Phone, Loader2, FileDown } from "lucide-react";

export function ContactSection() {
  const [formState, setFormState] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState("sending");
    // Simulate sending
    setTimeout(() => {
      setFormState("sent");
      setTimeout(() => setFormState("idle"), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase">
            Contact
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            {"Let's work together"}
          </h3>
          <p className="text-muted-foreground max-w-md">
            {
              "Have a project in mind or looking to hire? Drop me a message and I'll get back to you soon."
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Resume download */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center gap-3 mb-2">
                <FileDown className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Resume
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Download my latest resume for a full overview of my experience, skills, and education.
              </p>
              <a
                href="/DarriusJ_Davidson_Resume.pdf"
                download="DarriusJ_Davidson_Resume.pdf"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <FileDown className="h-4 w-4" />
                Download Resume
              </a>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Email</p>
                <a
                  href="https://mail.google.com/mail/?view=cm&to=ddavidson1230@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  ddavidson1230@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Phone</p>
                <a
                  href="tel:+13185412414"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  (318) 541-2414
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Location</p>
                <p className="text-muted-foreground text-sm">
                  Alexandria, LA | Baton Rouge, LA
                </p>
              </div>
            </div>

            {/* Availability badge */}
            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Available for hire
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {
                  "Currently open to full-time, freelance, and contract opportunities. Let's chat about your next project."
                }
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-border bg-card p-6 sm:p-8 flex flex-col gap-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="john@company.com"
                    className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="subject"
                  className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="Project inquiry"
                  className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formState !== "idle"}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {formState === "sending" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {formState === "sent" && "Message Sent!"}
                {formState === "sending" && "Sending..."}
                {formState === "idle" && (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
