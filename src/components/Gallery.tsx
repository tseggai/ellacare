"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
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
      <div role="group" aria-label="Filter photos" className="mb-8 inline-flex flex-wrap gap-1 rounded-full bg-white p-1.5 ring-1 ring-line">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className="min-h-11 rounded-full px-5 font-semibold text-muted transition-colors hover:text-ink aria-pressed:bg-ink aria-pressed:text-white"
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="grid auto-rows-[16rem] gap-4 sm:grid-cols-2 lg:auto-rows-[18rem] lg:grid-cols-3">
        {shown.map((room, i) => (
          <li key={room.src} className={i % 5 === 0 ? "sm:row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block h-full w-full overflow-hidden rounded-4xl text-left"
              aria-label={`View ${room.title} photo`}
            >
              <Image
                src={room.src}
                alt={room.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute right-4 bottom-4 left-4 flex items-end justify-between text-white">
                <span>
                  <span className="block text-sm font-semibold text-white/75">{room.category}</span>
                  <span className="text-xl font-semibold tracking-tight">{room.title}</span>
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur transition-colors group-hover:bg-white group-hover:text-ink">
                  <Expand className="h-4 w-4" aria-hidden />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && setIndex(null)}
        className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-night/95 backdrop:backdrop-blur"
        aria-label={current?.title}
      >
        {current && (
          <figure className="flex h-full flex-col text-white" onClick={(e) => e.target === e.currentTarget && setIndex(null)}>
            <div className="flex items-center justify-between p-4 sm:p-6">
              <figcaption className="text-lg font-semibold">
                {current.title} <span className="font-normal text-white/50">· {index! + 1} / {shown.length}</span>
              </figcaption>
              <button type="button" onClick={() => setIndex(null)} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mx-4 flex-1 sm:mx-20">
              <Image src={current.src} alt={current.title} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex justify-center gap-3 p-4 sm:p-6">
              <button type="button" onClick={() => step(-1)} className="grid h-14 w-14 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Previous photo">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" onClick={() => step(1)} className="grid h-14 w-14 place-items-center rounded-full bg-white text-ink hover:bg-sky-tint" aria-label="Next photo">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </div>
  );
}
