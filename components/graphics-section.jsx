"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
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

        {/* Grid -- compact thumbnails to showcase many items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredGraphics.map((graphic) => (
            <div
              key={graphic.id || graphic.title}
              className="group relative rounded-lg overflow-hidden border border-border aspect-square cursor-pointer"
            >
              <button
                type="button"
                onClick={() => setLightboxImage(graphic)}
                className="w-full h-full text-left"
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
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <span className="text-[10px] font-mono text-primary tracking-widest uppercase mb-0.5 truncate">
                    {graphic.category}
                  </span>
                  <span className="text-xs font-bold text-foreground truncate">
                    {graphic.title}
                  </span>
                </div>
              </button>
              {graphic.link && (
                <a
                  href={graphic.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 rounded-md bg-primary/90 p-1.5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-primary"
                  aria-label={`View ${graphic.title} portfolio`}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
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
          <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              {lightboxImage.image && lightboxImage.image.startsWith("data:") ? (
                <img
                  src={lightboxImage.image || "/placeholder.svg"}
                  alt={lightboxImage.title || "Enlarged graphic preview"}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={lightboxImage.image || "/placeholder.svg"}
                  alt={lightboxImage.title || "Enlarged graphic preview"}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-foreground">{lightboxImage.title}</span>
              {lightboxImage.link && (
                <a
                  href={lightboxImage.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Project
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
