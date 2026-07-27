"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  CalendarX,
  Fingerprint,
  ExternalLink,
  Layers,
  Tag,
} from "lucide-react";

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="break-words text-sm text-foreground">{children}</span>
      </div>
    </div>
  );
}

export function CredentialDialog({ credential, open, onOpenChange }) {
  if (!credential) return null;

  const issued = formatDate(credential.issueDate);
  const expires = formatDate(credential.expirationDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 pb-2">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary">
              {credential.badgeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={credential.badgeImage || "/placeholder.svg"}
                  alt={`${credential.title} badge`}
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Award className="h-12 w-12 text-primary" />
              )}
            </div>
            <DialogTitle className="text-center text-xl leading-snug text-foreground">
              {credential.title}
            </DialogTitle>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                {credential.provider}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {credential.level}
              </span>
              {credential.verified && (
                <span className="flex items-center gap-1 rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        {credential.description && (
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {credential.description}
          </p>
        )}

        <div className="divide-y divide-border">
          <InfoRow icon={Building2} label="Issuer">
            {credential.issuer || "—"}
          </InfoRow>
          <InfoRow icon={Calendar} label="Issue Date">
            {issued || "—"}
          </InfoRow>
          {expires && (
            <InfoRow icon={CalendarX} label="Expiration Date">
              {expires}
            </InfoRow>
          )}
          {credential.credentialId && (
            <InfoRow icon={Fingerprint} label="Credential ID">
              <span className="font-mono text-xs">{credential.credentialId}</span>
            </InfoRow>
          )}

          {credential.skills?.length > 0 && (
            <InfoRow icon={Layers} label="Skills Earned">
              <span className="flex flex-wrap gap-1.5 pt-1">
                {credential.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                  >
                    {s}
                  </span>
                ))}
              </span>
            </InfoRow>
          )}

          {credential.tags?.length > 0 && (
            <InfoRow icon={Tag} label="Tags">
              <span className="flex flex-wrap gap-1.5 pt-1">
                {credential.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </span>
            </InfoRow>
          )}
        </div>

        {credential.verificationUrl && (
          <a
            href={credential.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" />
            Verify Credential
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}
