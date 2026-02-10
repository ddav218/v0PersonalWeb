"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useGraphics, GRAPHIC_CATEGORIES } from "@/hooks/use-portfolio-data";

export function GraphicsSection() {
  const { graphics } = useGraphics();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ["All", ...GRAPHIC_CATEGORIES];

  const filteredGraphics =
    activeCategory === "All"
      ? graphics
      : graphics.filter((g) => g.category === activeCategory);

  return (
    <section id="graphics" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase">
            Graphics Portfolio
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Visual creations
          </h3>
          <p className="text-muted-foreground max-w-md">
            A curated collection of graphic design work across organizations
            and freelance projects.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGraphics.map((graphic) => (
            <button
              key={graphic.id || graphic.title}
              type="button"
              onClick={() => setLightboxImage(graphic.image)}
              className="group relative rounded-xl overflow-hidden border border-border aspect-[4/3] cursor-pointer text-left"
            >
              {graphic.image && graphic.image.startsWith("data:") ? (
                <img
                  src={graphic.image || "/placeholder.svg"}
                  alt={graphic.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={graphic.image || "/placeholder.svg"}
                  alt={graphic.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-xs font-mono text-primary tracking-widest uppercase mb-1">
                  {graphic.category}
                </span>
                <span className="text-lg font-bold text-foreground">
                  {graphic.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden">
            {lightboxImage.startsWith("data:") ? (
              <img
                src={lightboxImage || "/placeholder.svg"}
                alt="Enlarged graphic preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={lightboxImage || "/placeholder.svg"}
                alt="Enlarged graphic preview"
                fill
                className="object-contain"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
