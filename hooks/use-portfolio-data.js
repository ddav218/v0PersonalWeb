"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEYS = {
  projects: "portfolio_projects",
  skills: "portfolio_skills",
  graphics: "portfolio_graphics",
};

const defaultProjects = [
  {
    id: "default-1",
    title: "Analytics Dashboard",
    description:
      "A real-time data visualization dashboard built with React and D3.js. Features interactive charts, custom widgets, and a dark-themed interface.",
    image: "/images/project-1.jpg",
    tags: ["React", "TypeScript", "D3.js", "Tailwind CSS"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "default-2",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce application with product management, cart system, and payment integration. Optimized for mobile-first experiences.",
    image: "/images/project-2.jpg",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "default-3",
    title: "Social Connect App",
    description:
      "A social networking platform with real-time messaging, user profiles, and content feeds. Built for scalability and performance.",
    image: "/images/project-3.jpg",
    tags: ["React", "Firebase", "WebSocket", "Material UI"],
    liveUrl: "#",
    repoUrl: "#",
  },
];

const defaultSkills = {
  programmingLanguages: [
    { name: "Java", level: "Proficient" },
    { name: "JavaScript", level: "Proficient" },
    { name: "TypeScript", level: "Proficient" },
    { name: "Python", level: "Proficient" },
    { name: "HTML", level: "Intermediate" },
    { name: "C#", level: "Intermediate" },
    { name: "Unix/Linux", level: "Intermediate" },
    { name: "C", level: "Intermediate" },
  ],
  digitalMediaTools: [
    { name: "Canva", level: "Proficient" },
    { name: "Adobe Photoshop", level: "Intermediate" },
    { name: "Adobe InDesign", level: "Intermediate" },
    { name: "Microsoft Office", level: "Intermediate" },
    { name: "SEO Optimization", level: "Basic" },
    { name: "Figma", level: "Basic" },
    { name: "Adobe Illustrator", level: "Basic" },
    { name: "Premier Pro", level: "Basic" },
  ],
};

const defaultGraphics = [
  {
    id: "default-g1",
    title: "NPHC Promotional Flyer",
    category: "National Panhellenic Council",
    image: "/images/graphic-1.jpg",
  },
  {
    id: "default-g2",
    title: "NPHC Event Branding",
    category: "National Panhellenic Council",
    image: "/images/graphic-2.jpg",
  },
  {
    id: "default-g3",
    title: "Alpha Phi Alpha Chapter Graphics",
    category: "Nu Psi Chapter of Alpha Phi Alpha Fraternity, Inc.",
    image: "/images/graphic-3.jpg",
  },
  {
    id: "default-g4",
    title: "Alpha Phi Alpha Event Poster",
    category: "Nu Psi Chapter of Alpha Phi Alpha Fraternity, Inc.",
    image: "/images/graphic-4.jpg",
  },
  {
    id: "default-g5",
    title: "Student Government Campaign",
    category: "LSU Student Government",
    image: "/images/graphic-5.jpg",
  },
  {
    id: "default-g6",
    title: "Freelance Brand Design",
    category: "Freelance",
    image: "/images/graphic-6.jpg",
  },
];

function getStored(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function useProjects() {
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    setProjects(getStored(STORAGE_KEYS.projects, defaultProjects));
  }, []);

  const addProject = useCallback((project) => {
    setProjects((prev) => {
      const updated = [...prev, { ...project, id: `proj-${Date.now()}` }];
      setStored(STORAGE_KEYS.projects, updated);
      return updated;
    });
  }, []);

  const updateProject = useCallback((id, data) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
      setStored(STORAGE_KEYS.projects, updated);
      return updated;
    });
  }, []);

  const removeProject = useCallback((id) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      setStored(STORAGE_KEYS.projects, updated);
      return updated;
    });
  }, []);

  return { projects, addProject, updateProject, removeProject };
}

export function useSkills() {
  const [skills, setSkills] = useState(defaultSkills);

  useEffect(() => {
    setSkills(getStored(STORAGE_KEYS.skills, defaultSkills));
  }, []);

  const addSkill = useCallback((category, skill) => {
    setSkills((prev) => {
      const updated = {
        ...prev,
        [category]: [...prev[category], skill],
      };
      setStored(STORAGE_KEYS.skills, updated);
      return updated;
    });
  }, []);

  const removeSkill = useCallback((category, skillName) => {
    setSkills((prev) => {
      const updated = {
        ...prev,
        [category]: prev[category].filter((s) => s.name !== skillName),
      };
      setStored(STORAGE_KEYS.skills, updated);
      return updated;
    });
  }, []);

  const updateSkill = useCallback((category, oldName, newData) => {
    setSkills((prev) => {
      const updated = {
        ...prev,
        [category]: prev[category].map((s) =>
          s.name === oldName ? { ...s, ...newData } : s
        ),
      };
      setStored(STORAGE_KEYS.skills, updated);
      return updated;
    });
  }, []);

  return { skills, addSkill, removeSkill, updateSkill };
}

export function useGraphics() {
  const [graphics, setGraphics] = useState(defaultGraphics);

  useEffect(() => {
    setGraphics(getStored(STORAGE_KEYS.graphics, defaultGraphics));
  }, []);

  const addGraphic = useCallback((graphic) => {
    setGraphics((prev) => {
      const updated = [...prev, { ...graphic, id: `gfx-${Date.now()}` }];
      setStored(STORAGE_KEYS.graphics, updated);
      return updated;
    });
  }, []);

  const removeGraphic = useCallback((id) => {
    setGraphics((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      setStored(STORAGE_KEYS.graphics, updated);
      return updated;
    });
  }, []);

  return { graphics, addGraphic, removeGraphic };
}

export const GRAPHIC_CATEGORIES = [
  "National Panhellenic Council",
  "Nu Psi Chapter of Alpha Phi Alpha Fraternity, Inc.",
  "LSU Student Government",
  "Freelance",
];
