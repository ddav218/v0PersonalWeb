"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Check,
  Sparkles,
  Download,
  Loader2,
  BrainCircuit,
  Wand2,
  Save,
  FileText,
  Activity,
} from "lucide-react";
import {
  useCredentials,
  useSettings,
  useSkillGraph,
  CREDENTIAL_PROVIDERS,
  CREDENTIAL_LEVELS,
} from "@/hooks/use-portfolio-data";

const EMPTY = {
  title: "",
  issuer: "",
  provider: "Credly",
  issueDate: "",
  expirationDate: "",
  credentialId: "",
  verificationUrl: "",
  badgeImage: "",
  skills: "",
  level: "Foundational",
  tags: "",
  description: "",
  verified: true,
};

const inputCls =
  "rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";
const labelCls =
  "text-xs font-mono text-muted-foreground uppercase tracking-wider";

export function CredentialsManager() {
  const {
    credentials,
    addCredential,
    updateCredential,
    removeCredential,
    discoverFromCredly,
  } = useCredentials();
  const { settings, updateSetting } = useSettings();
  const { graph, regenerate } = useSkillGraph();

  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // AI tool state
  const [credlyUser, setCredlyUser] = useState("");
  const [discovering, setDiscovering] = useState(false);
  const [discoverMsg, setDiscoverMsg] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [pasteProvider, setPasteProvider] = useState("Oracle University");
  const [parsing, setParsing] = useState(false);
  const [parseMsg, setParseMsg] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeMsg, setAnalyzeMsg] = useState("");

  // Resume upload state
  const [resumeName, setResumeName] = useState("");
  const [resumeMsg, setResumeMsg] = useState("");
  const [savingResume, setSavingResume] = useState(false);

  // Availability status state
  const [availStatus, setAvailStatus] = useState("available");
  const [availDesc, setAvailDesc] = useState("");
  const [savingAvail, setSavingAvail] = useState(false);
  const [availMsg, setAvailMsg] = useState("");

  useEffect(() => {
    if (settings?.credly_username !== undefined) {
      setCredlyUser(settings.credly_username || "");
    }
  }, [settings?.credly_username]);

  useEffect(() => {
    if (settings?.availability_status !== undefined) {
      setAvailStatus(settings.availability_status || "available");
    }
  }, [settings?.availability_status]);

  useEffect(() => {
    if (settings?.availability_description !== undefined) {
      setAvailDesc(settings.availability_description || "");
    }
  }, [settings?.availability_description]);

  async function handleSaveAvailability() {
    setSavingAvail(true);
    setAvailMsg("");
    await updateSetting("availability_status", availStatus);
    await updateSetting("availability_description", availDesc);
    setSavingAvail(false);
    setAvailMsg("Availability status saved.");
  }

  useEffect(() => {
    if (settings?.resume_name !== undefined) {
      setResumeName(settings.resume_name || "");
    }
  }, [settings?.resume_name]);

  async function handleResumeUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSavingResume(true);
    setResumeMsg("");
    const reader = new FileReader();
    reader.onloadend = async () => {
      await updateSetting("resume_url", reader.result);
      await updateSetting("resume_name", file.name);
      setResumeName(file.name);
      setSavingResume(false);
      setResumeMsg("Resume/CV uploaded.");
    };
    reader.readAsDataURL(file);
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
  }

  function beginEdit(c) {
    setForm({
      title: c.title || "",
      issuer: c.issuer || "",
      provider: c.provider || "Credly",
      issueDate: c.issueDate || "",
      expirationDate: c.expirationDate || "",
      credentialId: c.credentialId || "",
      verificationUrl: c.verificationUrl || "",
      badgeImage: c.badgeImage || "",
      skills: (c.skills || []).join(", "),
      level: c.level || "Foundational",
      tags: (c.tags || []).join(", "),
      description: c.description || "",
      verified: c.verified !== false,
    });
    setEditingId(c.id);
    setShowForm(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toPayload() {
    return {
      title: form.title.trim(),
      issuer: form.issuer.trim(),
      provider: form.provider,
      issueDate: form.issueDate || null,
      expirationDate: form.expirationDate || null,
      credentialId: form.credentialId.trim(),
      verificationUrl: form.verificationUrl.trim(),
      badgeImage: form.badgeImage.trim(),
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      level: form.level,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      description: form.description.trim(),
      verified: form.verified,
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = toPayload();
    if (editingId) {
      updateCredential(editingId, payload);
    } else {
      addCredential({ ...payload, source: editingId ? undefined : "manual" });
    }
    resetForm();
  }

  async function handleSaveCredly() {
    await updateSetting("credly_username", credlyUser.trim());
    setDiscoverMsg("Credly username saved.");
  }

  async function handleDiscover() {
    setDiscovering(true);
    setDiscoverMsg("");
    await updateSetting("credly_username", credlyUser.trim());
    const result = await discoverFromCredly(credlyUser.trim());
    setDiscovering(false);
    if (result?.error) {
      setDiscoverMsg(result.error);
    } else {
      setDiscoverMsg(
        `Imported ${result.imported} of ${result.total} badge(s) from @${result.username}.`
      );
    }
  }

  async function handleParse() {
    if (!pasteText.trim()) return;
    setParsing(true);
    setParseMsg("");
    try {
      const res = await fetch("/api/credentials/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasteText, provider: pasteProvider }),
      });
      const data = await res.json();
      if (data?.error) {
        setParseMsg(data.error);
      } else if (data?.credential) {
        const c = data.credential;
        setForm({
          title: c.title || "",
          issuer: c.issuer || "",
          provider: c.provider || pasteProvider,
          issueDate: c.issueDate || "",
          expirationDate: c.expirationDate || "",
          credentialId: c.credentialId || "",
          verificationUrl: c.verificationUrl || "",
          badgeImage: c.badgeImage || "",
          skills: (c.skills || []).join(", "),
          level: c.level || "Foundational",
          tags: (c.tags || []).join(", "),
          description: c.description || "",
          verified: false,
        });
        setEditingId(null);
        setShowForm(true);
        setParseMsg("AI extracted a draft below. Review and save it.");
        setPasteText("");
      }
    } catch {
      setParseMsg("Something went wrong. Try again.");
    }
    setParsing(false);
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    setAnalyzeMsg("");
    const result = await regenerate();
    setAnalyzing(false);
    if (result?.error) {
      setAnalyzeMsg(result.error);
    } else {
      setAnalyzeMsg(
        `Skill graph regenerated with ${result?.domains?.length || 0} domains.`
      );
    }
  }

  function handleBadgeUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => set("badgeImage", reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Digital Credentials</h2>
          <p className="text-sm text-muted-foreground">
            {credentials.length} credential{credentials.length !== 1 ? "s" : ""} · powers the{" "}
            <span className="font-mono text-primary">/ibm</span> page
          </p>
        </div>
        <button
          type="button"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Credential"}
        </button>
      </div>

      {/* ===================== AI AGENT TOOLS ===================== */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Credly discovery */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Credly Auto-Discovery</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Automatically pull and verify public badges from your Credly profile.
          </p>
          <input
            type="text"
            value={credlyUser}
            onChange={(e) => setCredlyUser(e.target.value)}
            placeholder="Credly username or profile URL"
            className={inputCls}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveCredly}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
            <button
              type="button"
              onClick={handleDiscover}
              disabled={discovering}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {discovering ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {discovering ? "Discovering..." : "Discover"}
            </button>
          </div>
          {discoverMsg && (
            <p className="text-xs text-muted-foreground">{discoverMsg}</p>
          )}
        </div>

        {/* AI import */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">AI-Assisted Import</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste any certificate text or URL from IBM SkillsBuild, Oracle University,
            Udemy, or Harvard. AI structures it for you.
          </p>
          <select
            value={pasteProvider}
            onChange={(e) => setPasteProvider(e.target.value)}
            className={inputCls}
          >
            {CREDENTIAL_PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={3}
            placeholder="Paste credential details here..."
            className={`${inputCls} resize-none`}
          />
          <button
            type="button"
            onClick={handleParse}
            disabled={parsing || !pasteText.trim()}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {parsing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {parsing ? "Parsing..." : "Parse with AI"}
          </button>
          {parseMsg && <p className="text-xs text-muted-foreground">{parseMsg}</p>}
        </div>

        {/* AI skill graph */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">AI Skill Graph</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Re-analyze all credentials to rebuild the public skill graph and summary.
          </p>
          {graph?.generatedAt && (
            <p className="text-xs text-muted-foreground">
              Last generated:{" "}
              {new Date(graph.generatedAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
          {graph?.summary && (
            <p className="line-clamp-3 rounded-lg bg-secondary p-2.5 text-xs text-muted-foreground">
              {graph.summary}
            </p>
          )}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {analyzing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <BrainCircuit className="h-3.5 w-3.5" />
            )}
            {analyzing ? "Analyzing..." : "Regenerate Skill Graph"}
          </button>
          {analyzeMsg && <p className="text-xs text-muted-foreground">{analyzeMsg}</p>}
        </div>
      </div>

      {/* ===================== RESUME / CV ===================== */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Resume / CV</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload the PDF used by the &quot;Download Resume/CV&quot; button on the{" "}
          <span className="font-mono text-primary">/ibm</span> contact section.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            {savingResume ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileText className="h-3.5 w-3.5" />
            )}
            {savingResume ? "Uploading..." : "Upload Resume/CV"}
            <input
              type="file"
              accept="application/pdf,.pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </label>
          {resumeName && (
            <span className="text-xs text-muted-foreground">
              Current: <span className="text-foreground">{resumeName}</span>
            </span>
          )}
        </div>
        {resumeMsg && <p className="text-xs text-muted-foreground">{resumeMsg}</p>}
      </div>

      {/* ===================== AVAILABILITY STATUS ===================== */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Availability Status
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Controls the status badge shown on the{" "}
          <span className="font-mono text-primary">/ibm</span> contact section.
        </p>

        <div className="grid gap-2 sm:grid-cols-3">
          {[
            {
              value: "available",
              label: "Available for hire",
              hint: "Open to opportunities",
            },
            {
              value: "staffed",
              label: "Staffed on a project",
              hint: "Add a project description",
            },
            {
              value: "bench",
              label: "On the bench",
              hint: "Add a credential in progress",
            },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAvailStatus(opt.value)}
              className={`flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors ${
                availStatus === opt.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/40 hover:border-primary/40"
              }`}
            >
              <span className="text-xs font-semibold text-foreground">
                {opt.label}
              </span>
              <span className="text-[11px] text-muted-foreground">{opt.hint}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>
            {availStatus === "staffed"
              ? "Project description"
              : availStatus === "bench"
              ? "Credential in progress"
              : "Description"}
          </label>
          <textarea
            value={availDesc}
            onChange={(e) => setAvailDesc(e.target.value)}
            rows={3}
            placeholder={
              availStatus === "staffed"
                ? "e.g. Leading an OIC integration rollout for an enterprise finance client."
                : availStatus === "bench"
                ? "e.g. Currently pursuing the Oracle Cloud Infrastructure Integration Professional certification."
                : "e.g. Open to full-time, freelance, and contract integration work."
            }
            className={inputCls}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAvailability}
            disabled={savingAvail}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {savingAvail ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {savingAvail ? "Saving..." : "Save Status"}
          </button>
          {availMsg && (
            <span className="text-xs text-muted-foreground">{availMsg}</span>
          )}
        </div>
      </div>

      {/* ===================== ADD / EDIT FORM ===================== */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-primary">
            {editingId ? "Edit Credential" : "New Credential"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
                placeholder="Oracle Integration Cloud Certified"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Issuer</label>
              <input
                type="text"
                value={form.issuer}
                onChange={(e) => set("issuer", e.target.value)}
                placeholder="Oracle"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Provider</label>
              <select
                value={form.provider}
                onChange={(e) => set("provider", e.target.value)}
                className={inputCls}
              >
                {CREDENTIAL_PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Level</label>
              <select
                value={form.level}
                onChange={(e) => set("level", e.target.value)}
                className={inputCls}
              >
                {CREDENTIAL_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Credential ID</label>
              <input
                type="text"
                value={form.credentialId}
                onChange={(e) => set("credentialId", e.target.value)}
                placeholder="ABC-123"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Issue Date</label>
              <input
                type="date"
                value={form.issueDate || ""}
                onChange={(e) => set("issueDate", e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Expiration Date</label>
              <input
                type="date"
                value={form.expirationDate || ""}
                onChange={(e) => set("expirationDate", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Verification URL</label>
            <input
              type="url"
              value={form.verificationUrl}
              onChange={(e) => set("verificationUrl", e.target.value)}
              placeholder="https://www.credly.com/badges/..."
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Badge Image</label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={form.badgeImage}
                onChange={(e) => set("badgeImage", e.target.value)}
                placeholder="Image URL, or upload"
                className={`${inputCls} flex-1`}
              />
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2.5 text-xs font-medium text-foreground hover:border-primary/50 transition-colors">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBadgeUpload}
                  className="hidden"
                />
              </label>
              {form.badgeImage && (
                <div className="h-12 w-12 overflow-hidden rounded-md border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.badgeImage || "/placeholder.svg"}
                    alt="Badge preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Skills (comma separated)</label>
              <input
                type="text"
                value={form.skills}
                onChange={(e) => set("skills", e.target.value)}
                placeholder="SOA, REST, API Management"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="Integration, Middleware, Cloud"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              placeholder="Short summary of the credential..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(e) => set("verified", e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Mark as verified
          </label>

          <button
            type="submit"
            className="flex items-center gap-2 self-end rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Update Credential" : "Save Credential"}
          </button>
        </form>
      )}

      {/* ===================== LIST ===================== */}
      <div className="flex flex-col gap-3">
        {credentials.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary">
                {c.badgeImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.badgeImage || "/placeholder.svg"}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Sparkles className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {c.title}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  {c.issuer} · {c.provider} · {c.level}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono text-primary/80">
                    {c.source}
                  </span>
                  {c.skills?.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="ml-2 flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => beginEdit(c)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label={`Edit ${c.title}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removeCredential(c.id)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Delete ${c.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {credentials.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No credentials yet. Use Credly discovery or AI import above to get started.
          </div>
        )}
      </div>
    </div>
  );
}
