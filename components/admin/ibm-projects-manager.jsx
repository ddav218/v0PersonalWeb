"use client";

import { useState } from "react";
import { Plus, X, Pencil, Trash2, Upload, BriefcaseBusiness } from "lucide-react";
import { useIbmProjects } from "@/hooks/use-portfolio-data";

const EMPTY = {
  category: "billable",
  client: "",
  title: "",
  role: "",
  description: "",
  image: "",
  tags: "",
  liveUrl: "",
  repoUrl: "",
  startDate: "",
  endDate: "",
};

const inputClass =
  "rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";
const labelClass = "text-xs font-mono text-muted-foreground uppercase tracking-wider";

function Field({ id, label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ProjectRow({ project, onEdit, onDelete }) {
  return (
    <li className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
      <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-semibold text-foreground">{project.title}</h4>
          {project.client && (
            <span className="text-xs text-muted-foreground">{`· ${project.client}`}</span>
          )}
        </div>
        {project.role && <p className="text-xs text-primary">{project.role}</p>}
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onEdit(project)}
          aria-label={`Edit ${project.title}`}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(project)}
          aria-label={`Delete ${project.title}`}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

export function IbmProjectsManager() {
  const { ibmProjects, addIbmProject, updateIbmProject, removeIbmProject, isLoading } =
    useIbmProjects();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function reset() {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startAdd(category) {
    setForm({ ...EMPTY, category });
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(project) {
    setForm({ ...EMPTY, ...project, tags: project.tags.join(", ") });
    setEditingId(project.id);
    setShowForm(true);
    setError("");
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) await updateIbmProject(editingId, payload);
      else await addIbmProject(payload);
      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(project) {
    if (window.confirm(`Delete "${project.title}"?`)) removeIbmProject(project.id);
  }

  const groups = [
    { id: "billable", title: "Clients & Projects - Billables" },
    { id: "non-billable", title: "Clients & Projects - Non-billables" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-foreground">Clients &amp; Projects</h2>
        <p className="text-sm text-muted-foreground">
          Manage the billable and non-billable work shown on the IBM page.
        </p>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-wider text-primary">
              {editingId ? "Edit project" : "New project"}
            </p>
            <button
              type="button"
              onClick={reset}
              aria-label="Close form"
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="ibm-category" label="Category *">
              <select
                id="ibm-category"
                value={form.category}
                onChange={set("category")}
                className={inputClass}
              >
                <option value="billable">Billable</option>
                <option value="non-billable">Non-billable</option>
              </select>
            </Field>
            <Field id="ibm-client" label="Client">
              <input id="ibm-client" value={form.client} onChange={set("client")} placeholder="Client or internal team" className={inputClass} />
            </Field>
            <Field id="ibm-title" label="Project title *">
              <input id="ibm-title" value={form.title} onChange={set("title")} required placeholder="Oracle Integration Cloud migration" className={inputClass} />
            </Field>
            <Field id="ibm-role" label="Your role">
              <input id="ibm-role" value={form.role} onChange={set("role")} placeholder="Integration Developer" className={inputClass} />
            </Field>
            <Field id="ibm-start" label="Start date">
              <input id="ibm-start" type="date" value={form.startDate} onChange={set("startDate")} className={inputClass} />
            </Field>
            <Field id="ibm-end" label="End date (blank = ongoing)">
              <input id="ibm-end" type="date" value={form.endDate} onChange={set("endDate")} className={inputClass} />
            </Field>
          </div>

          <Field id="ibm-description" label="Description">
            <textarea id="ibm-description" rows={4} value={form.description} onChange={set("description")} placeholder="What you delivered and the outcome" className={inputClass} />
          </Field>

          <Field id="ibm-tags" label="Tags (comma separated)">
            <input id="ibm-tags" value={form.tags} onChange={set("tags")} placeholder="OIC, REST, SOA Suite" className={inputClass} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="ibm-live" label="Live / reference URL">
              <input id="ibm-live" type="url" value={form.liveUrl} onChange={set("liveUrl")} placeholder="https://" className={inputClass} />
            </Field>
            <Field id="ibm-repo" label="Repository URL">
              <input id="ibm-repo" type="url" value={form.repoUrl} onChange={set("repoUrl")} placeholder="https://github.com/..." className={inputClass} />
            </Field>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={labelClass}>Image</span>
            <div className="flex items-center gap-4">
              {form.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="Project preview" className="size-16 rounded-lg border border-border object-cover" />
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary">
                <Upload className="h-4 w-4" />
                {form.image ? "Replace image" : "Upload image"}
                <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
              </label>
              {form.image && (
                <button type="button" onClick={() => setForm((f) => ({ ...f, image: "" }))} className="text-xs text-muted-foreground hover:text-destructive">
                  Remove
                </button>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={reset} className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
              {saving ? "Saving..." : editingId ? "Save changes" : "Add project"}
            </button>
          </div>
        </form>
      )}

      {groups.map((group) => {
        const items = ibmProjects.filter((p) => p.category === group.id);
        return (
          <section key={group.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">{group.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {`${items.length} project${items.length === 1 ? "" : "s"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startAdd(group.id)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No projects yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {items.map((p) => (
                  <ProjectRow key={p.id} project={p} onEdit={startEdit} onDelete={handleDelete} />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
