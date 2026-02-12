"use client";

import { useState } from "react";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Upload,
  Code,
  Palette,
  ImageIcon,
  FolderOpen,
  X,
  Pencil,
  Check,
} from "lucide-react";
import {
  useProjects,
  useSkills,
  useGraphics,
  GRAPHIC_CATEGORIES,
} from "@/hooks/use-portfolio-data";

const ADMIN_PASSWORD = "D@V!D$0N";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-primary/10 p-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Admin Access</h1>
              <p className="text-sm text-muted-foreground text-center">
                Enter your password to access the dashboard.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (password === ADMIN_PASSWORD) {
                  setAuthenticated(true);
                  setError("");
                } else {
                  setError("Incorrect password. Try again.");
                }
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard onLogout={() => setAuthenticated(false)} />
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("projects");

  const tabs = [
    { id: "projects", label: "Projects", icon: Code },
    { id: "skills", label: "Skills", icon: Palette },
    { id: "graphics", label: "Graphics", icon: ImageIcon },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-1.5">
              <FolderOpen className="h-4 w-4 text-primary" />
            </div>
            <h1 className="font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-6 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {activeTab === "projects" && <ProjectsManager />}
        {activeTab === "skills" && <SkillsManager />}
        {activeTab === "graphics" && <GraphicsManager />}
      </div>
    </>
  );
}

/* ===================== PROJECTS MANAGER ===================== */
function ProjectsManager() {
  const { projects, addProject, updateProject, removeProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  function resetForm() {
    setTitle("");
    setDescription("");
    setTags("");
    setLiveUrl("");
    setRepoUrl("");
    setImagePreview("");
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(project) {
    setTitle(project.title);
    setDescription(project.description);
    setTags(project.tags ? project.tags.join(", ") : "");
    setLiveUrl(project.liveUrl || "");
    setRepoUrl(project.repoUrl || "");
    setImagePreview(project.image || "");
    setImageFile(null);
    setEditingId(project.id);
    setShowForm(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      image: imagePreview || "/images/project-1.jpg",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      liveUrl: liveUrl.trim() || "#",
      repoUrl: repoUrl.trim() || "#",
    };
    if (editingId) {
      updateProject(editingId, projectData);
    } else {
      addProject(projectData);
    }
    resetForm();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Coding Projects</h2>
          <p className="text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Project"}
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
        >
          <p className="text-xs font-mono text-primary uppercase tracking-wider">
            {editingId ? "Edit Project" : "New Project"}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Project"
                required
                className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, Node.js, PostgreSQL"
                className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              required
              rows={3}
              className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Cover image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Cover Image
            </label>
            <div className="flex items-start gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary px-4 py-6 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                {imageFile ? imageFile.name : "Upload cover image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="w-28 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Live URL
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
                className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Repo URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            className="self-end flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Update Project" : "Save Project"}
          </button>
        </form>
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {project.image && (
                <div className="w-16 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-primary/70 bg-primary/10 rounded px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <button
                type="button"
                onClick={() => handleEdit(project)}
                className="rounded-lg p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label={`Edit ${project.title}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label={`Delete ${project.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== SKILLS MANAGER ===================== */
function SkillsManager() {
  const { skills, addSkill, removeSkill } = useSkills();
  const [category, setCategory] = useState("programmingLanguages");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Intermediate");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    addSkill(category, { name: name.trim(), level });
    setName("");
    setLevel("Intermediate");
  }

  const categoryLabel =
    category === "programmingLanguages"
      ? "Programming Languages"
      : "Digital Media Tools";

  const levelColors = {
    Proficient: "border-primary/60 text-primary",
    Intermediate: "border-primary/30 text-muted-foreground",
    Basic: "border-border text-muted-foreground/70",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Manage your programming languages and digital media tools.
        </p>
      </div>

      {/* Category toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCategory("programmingLanguages")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            category === "programmingLanguages"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground border border-border hover:text-foreground"
          }`}
        >
          Programming Languages
        </button>
        <button
          type="button"
          onClick={() => setCategory("digitalMediaTools")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            category === "digitalMediaTools"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground border border-border hover:text-foreground"
          }`}
        >
          Digital Media Tools
        </button>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row gap-4 items-end"
      >
        <div className="flex-1 flex flex-col gap-1.5 w-full">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Skill Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              category === "programmingLanguages"
                ? "e.g. Rust"
                : "e.g. After Effects"
            }
            required
            className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Proficient">Proficient</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Basic">Basic</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus className="h-4 w-4 inline-block mr-1" />
          Add Skill
        </button>
      </form>

      {/* Current skills */}
      <div>
        <h3 className="text-sm font-mono text-primary tracking-wider uppercase mb-4">
          {categoryLabel}
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills[category].map((skill) => (
            <span
              key={skill.name}
              className={`group flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-xs font-mono border ${levelColors[skill.level]}`}
            >
              {skill.name}
              <span className="opacity-60">({skill.level})</span>
              <button
                type="button"
                onClick={() => removeSkill(category, skill.name)}
                className="opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                aria-label={`Remove ${skill.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================== GRAPHICS MANAGER ===================== */
function GraphicsManager() {
  const { graphics, addGraphic, removeGraphic } = useGraphics();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(GRAPHIC_CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const finalImage = imagePreview || imageUrl.trim() || "/images/graphic-1.jpg";
    addGraphic({
      title: title.trim(),
      category,
      image: finalImage,
    });
    setTitle("");
    setCategory(GRAPHIC_CATEGORIES[0]);
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Graphics</h2>
          <p className="text-sm text-muted-foreground">
            {graphics.length} graphic{graphics.length !== 1 ? "s" : ""} across{" "}
            {GRAPHIC_CATEGORIES.length} categories
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Graphic"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Graphic title"
                required
                className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {GRAPHIC_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary px-4 py-6 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                {imageFile ? imageFile.name : "Upload image file"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <div className="flex items-center text-xs text-muted-foreground">or</div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageFile(null);
                  setImagePreview("");
                }}
                placeholder="Paste image URL"
                className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {imagePreview && (
              <div className="mt-2 w-32 h-24 rounded-lg overflow-hidden border border-border">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="self-end rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Save Graphic
          </button>
        </form>
      )}

      {/* Graphics by category */}
      {GRAPHIC_CATEGORIES.map((cat) => {
        const catGraphics = graphics.filter((g) => g.category === cat);
        if (catGraphics.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="text-sm font-mono text-primary tracking-wider uppercase mb-3">
              {cat}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {catGraphics.map((graphic) => (
                <div
                  key={graphic.id}
                  className="group relative rounded-xl overflow-hidden border border-border aspect-[4/3]"
                >
                  <img
                    src={graphic.image || "/placeholder.svg"}
                    alt={graphic.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <button
                      type="button"
                      onClick={() => removeGraphic(graphic.id)}
                      className="self-end rounded-md p-1.5 bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                      aria-label={`Delete ${graphic.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-medium text-foreground truncate">
                      {graphic.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
