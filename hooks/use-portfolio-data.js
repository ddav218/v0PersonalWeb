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
