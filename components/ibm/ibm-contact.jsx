"use client";

import { useState } from "react";
import { Send, MapPin, Mail, Phone, Loader2, FileDown } from "lucide-react";
import { useSettings } from "@/hooks/use-portfolio-data";

export function IbmContact() {
  const { settings } = useSettings();
  const [formState, setFormState] = useState("idle");

  const resumeUrl = settings?.resume_url || "";
  const resumeName = settings?.resume_name || "DarriusJ_Davidson_Resume.pdf";

  const statusKey = settings?.availability_status || "available";
  const statusConfig = {
    available: {
      label: "Available for hire",
      defaultDesc:
        "Currently open to full-time, freelance, and contract opportunities. Let's chat about your next project.",
      dot: "bg-green-500",
      pulse: true,
    },
    staffed: {
      label: "Currently staffed on a project",
      defaultDesc: "Actively engaged on a client project.",
      dot: "bg-amber-500",
      pulse: false,
    },
    bench: {
      label: "Currently on the bench",
      defaultDesc: "Between engagements and sharpening a new credential.",
      dot: "bg-primary",
      pulse: true,
    },
  };
  const status = statusConfig[statusKey] || statusConfig.available;
  const statusDesc = settings?.availability_description || status.defaultDesc;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState("sending");
    setTimeout(() => {
      setFormState("sent");
      setTimeout(() => setFormState("idle"), 3000);
    }, 1500);
  };

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* Section heading */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px w-12 bg-primary" />
          <h2 className="font-mono text-sm uppercase tracking-widest text-primary">
            Contact
          </h2>
        </div>

        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {"Let's work together"}
          </h3>
          <p className="max-w-md text-muted-foreground">
            {
              "Have a project in mind or looking to hire? Drop me a message and I'll get back to you soon."
            }
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact info */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Resume / CV download */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="mb-2 flex items-center gap-3">
                <FileDown className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Resume / CV
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                Download my latest resume/CV for a full overview of my experience,
                skills, and education.
              </p>
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  download={resumeName}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <FileDown className="h-4 w-4" />
                  Download Resume/CV
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground">
                  <FileDown className="h-4 w-4" />
                  Resume/CV coming soon
                </span>
              )}
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Email</p>
                <a
                  href="https://mail.google.com/mail/?view=cm&to=ddavidson03@ibm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  ddavidson03@ibm.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Phone</p>
                <a
                  href="tel:+13185412414"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
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
                <p className="text-sm font-semibold text-foreground">Location</p>
                <p className="text-sm text-muted-foreground">Baton Rouge, LA</p>
              </div>
            </div>

            {/* Availability badge */}
            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  {status.pulse && (
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${status.dot}`}
                    />
                  )}
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${status.dot}`}
                  />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {status.label}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {statusDesc}
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="ibm-name"
                    className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="ibm-name"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="ibm-email"
                    className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="ibm-email"
                    name="email"
                    required
                    placeholder="john@company.com"
                    className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="ibm-subject"
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="ibm-subject"
                  name="subject"
                  required
                  placeholder="Project inquiry"
                  className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="ibm-message"
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Message
                </label>
                <textarea
                  id="ibm-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  className="resize-none rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
