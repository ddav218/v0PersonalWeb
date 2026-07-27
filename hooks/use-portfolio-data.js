"use client";

import useSWR from "swr";
import { useCallback } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

/* ===================== PROJECTS ===================== */
export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR("/api/projects", fetcher);

  const projects = data || [];

  const addProject = useCallback(
    async (project) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      const newProject = await res.json();
      mutate([newProject, ...projects], { revalidate: true });
    },
    [projects, mutate]
  );

  const updateProject = useCallback(
    async (id, data) => {
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      mutate();
    },
    [mutate]
  );

  const removeProject = useCallback(
    async (id) => {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      mutate(
        projects.filter((p) => p.id !== id),
        { revalidate: true }
      );
    },
    [projects, mutate]
  );

  return { projects, addProject, updateProject, removeProject, isLoading, error };
}

/* ===================== SKILLS ===================== */
export function useSkills() {
  const { data, error, isLoading, mutate } = useSWR("/api/skills", fetcher);

  const skills = data || {
    programmingLanguages: [],
    digitalMediaTools: [],
  };

  const addSkill = useCallback(
    async (category, skill) => {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...skill, category }),
      });
      mutate();
    },
    [mutate]
  );

  const removeSkill = useCallback(
    async (category, skillName) => {
      const skillItem = skills[category]?.find((s) => s.name === skillName);
      if (!skillItem) return;
      await fetch(`/api/skills?id=${skillItem.id}`, { method: "DELETE" });
      mutate();
    },
    [skills, mutate]
  );

  const updateSkill = useCallback(
    async (category, oldName, newData) => {
      const skillItem = skills[category]?.find((s) => s.name === oldName);
      if (!skillItem) return;
      await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: skillItem.id, ...newData }),
      });
      mutate();
    },
    [skills, mutate]
  );

  return { skills, addSkill, removeSkill, updateSkill, isLoading, error };
}

/* ===================== GRAPHICS ===================== */
export function useGraphics() {
  const { data, error, isLoading, mutate } = useSWR("/api/graphics", fetcher);

  const graphics = data || [];

  const addGraphic = useCallback(
    async (graphic) => {
      const res = await fetch("/api/graphics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphic),
      });
      const newGraphic = await res.json();
      mutate([newGraphic, ...graphics], { revalidate: true });
    },
    [graphics, mutate]
  );

  const removeGraphic = useCallback(
    async (id) => {
      await fetch(`/api/graphics?id=${id}`, { method: "DELETE" });
      mutate(
        graphics.filter((g) => g.id !== id),
        { revalidate: true }
      );
    },
    [graphics, mutate]
  );

  return { graphics, addGraphic, removeGraphic, isLoading, error };
}

export const GRAPHIC_CATEGORIES = [
  "National Panhellenic Council",
  "Nu Psi Chapter of Alpha Phi Alpha Fraternity, Inc.",
  "LSU Student Government",
  "Freelance",
];

/* ===================== CREDENTIALS ===================== */
export const CREDENTIAL_PROVIDERS = [
  "Credly",
  "IBM SkillsBuild",
  "Oracle University",
  "Udemy",
  "Harvard Manage Mentor",
  "Other",
];

export const CREDENTIAL_LEVELS = [
  "Foundational",
  "Intermediate",
  "Advanced",
  "Specialist",
];

export function useCredentials() {
  const { data, error, isLoading, mutate } = useSWR("/api/credentials", fetcher);

  const credentials = Array.isArray(data) ? data : [];

  const addCredential = useCallback(
    async (credential) => {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });
      const created = await res.json();
      mutate();
      return created;
    },
    [mutate]
  );

  const updateCredential = useCallback(
    async (id, credential) => {
      await fetch("/api/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...credential }),
      });
      mutate();
    },
    [mutate]
  );

  const removeCredential = useCallback(
    async (id) => {
      await fetch(`/api/credentials?id=${id}`, { method: "DELETE" });
      mutate(
        credentials.filter((c) => c.id !== id),
        { revalidate: true }
      );
    },
    [credentials, mutate]
  );

  const discoverFromCredly = useCallback(
    async (username) => {
      const res = await fetch("/api/credentials/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const result = await res.json();
      mutate();
      return result;
    },
    [mutate]
  );

  const discoverFromOracle = useCallback(
    async (username) => {
      const res = await fetch("/api/credentials/discover/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const result = await res.json();
      mutate();
      return result;
    },
    [mutate]
  );

  return {
    credentials,
    addCredential,
    updateCredential,
    removeCredential,
    discoverFromCredly,
    discoverFromOracle,
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR("/api/settings", fetcher);

  const settings = data || {};

  const updateSetting = useCallback(
    async (key, value) => {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      mutate();
    },
    [mutate]
  );

  return { settings, updateSetting, isLoading, error };
}

export function useSkillGraph() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/credentials/skill-graph",
    fetcher
  );

  const graph = data || { summary: "", domains: [], generatedAt: null };

  const regenerate = useCallback(async () => {
    const res = await fetch("/api/credentials/skill-graph", { method: "POST" });
    const result = await res.json();
    mutate();
    return result;
  }, [mutate]);

  return { graph, regenerate, isLoading, error };
}
