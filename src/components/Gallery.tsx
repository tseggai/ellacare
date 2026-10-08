"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Room } from "@/lib/site";

export function Gallery({ rooms }: { rooms: Room[] }) {
  const categories = ["All", ...Array.from(new Set(rooms.map((r) => r.category)))];
  const [filter, setFilter] = useState("All");
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const shown = filter === "All" ? rooms : rooms.filter((r) => r.category === filter);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current = index === null ? null : shown[index];

  return (
    <div>
      <div role="group" aria-label="Filter photos" className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className="btn min-h-11 border-2 border-line px-5 aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-white"
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((room, i) => (
          <li key={room.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group block w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-line"
            >
              <span className="relative block aspect-[4/3] overflow-hidden">
                <Image
                  src={room.src}
                  alt={room.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="flex items-center justify-between px-4 py-3">
                <span className="font-semibold">{room.title}</span>
                <span className="text-sm text-muted">{room.category}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && setIndex(null)}
        className="m-auto max-h-[92vh] w-[min(1100px,94vw)] rounded-2xl bg-ink p-0 text-white backdrop:bg-black/80"
        aria-label={current?.title}
      >
        {current && (
          <figure>
            <div className="relative h-[70vh]">
              <Image src={current.src} alt={current.title} fill sizes="94vw" className="object-contain" />
            </div>
            <figcaption className="flex items-center justify-between gap-2 p-3">
              <button type="button" onClick={() => step(-1)} className="btn min-h-11 bg-white/10 px-4 hover:bg-white/20">
                ← Prev
              </button>
              <span className="text-center font-semibold">
                {current.title}{" "}
                <span className="font-normal text-white/60">
                  ({index! + 1} of {shown.length})
                </span>
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={() => step(1)} className="btn min-h-11 bg-white/10 px-4 hover:bg-white/20">
                  Next →
                </button>
                <button type="button" onClick={() => setIndex(null)} className="btn min-h-11 bg-white px-4 text-ink">
                  Close
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </div>
  );
}
