"use client";

import { Check, Loader2, RotateCcw, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import type { PagePhotoSlot } from "@/lib/content";
import { setPagePhoto, uploadPagePhoto } from "./actions";

type Slot = { key: PagePhotoSlot; label: string; where: string; fallback: string; current: string };
type Pick = { id: string; src: string; title: string; published: boolean };

export function PhotoSlots({ slots, gallery }: { slots: Slot[]; gallery: Pick[] }) {
  const [open, setOpen] = useState<Slot | null>(null);
  return (
    <>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {slots.map((s) => (
          <li key={s.key} className="card overflow-hidden">
            <button type="button" onClick={() => setOpen(s)} className="block w-full text-left" aria-label={`Change ${s.label}`}>
              <span className="relative block aspect-[16/10]">
                <Image src={s.current} alt="" fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                <span className="absolute right-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wider text-ink uppercase">Change</span>
              </span>
              <span className="block p-4">
                <span className="block font-semibold">{s.label}</span>
                <span className="mt-0.5 block text-sm text-muted">{s.where}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {open && <PickerDialog key={open.key} slot={open} gallery={gallery} onClose={() => setOpen(null)} />}
    </>
  );
}

function PickerDialog({ slot, gallery, onClose }: { slot: Slot; gallery: Pick[]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function upload(file: File) {
    setPreview(URL.createObjectURL(file));
    setBusy("__upload__");
    setMsg(null);
    const fd = new FormData();
    fd.set("file", file);
    start(async () => {
      const res = await uploadPagePhoto(slot.key, fd);
      if (res.status === "error") {
        setMsg(res.message ?? "Upload failed.");
        setBusy(null);
        setPreview(null);
      } else {
        setTimeout(onClose, 400);
      }
    });
  }

  function choose(src: string) {
    setBusy(src);
    setMsg(null);
    start(async () => {
      const res = await setPagePhoto(slot.key, src);
      if (res.status === "error") {
        setMsg(res.message ?? "Could not save.");
        setBusy(null);
      } else {
        setTimeout(onClose, 400);
      }
    });
  }

  const isDefault = slot.current === slot.fallback && !gallery.some((g) => g.src === slot.current);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={`Choose a photo for ${slot.label}`}
      className="m-auto h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-night/60 backdrop:backdrop-blur-sm sm:h-auto sm:max-h-[92dvh] sm:max-w-3xl sm:p-4"
    >
      <div className="relative flex h-full flex-col overflow-y-auto bg-white px-6 pt-8 pb-8 sm:h-auto sm:rounded-4xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-paper ring-1 ring-line">
          <X className="h-5 w-5" aria-hidden />
        </button>
        <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">Choose a photo</p>
        <h2 className="mt-1 pr-12 text-2xl font-semibold tracking-tight">{slot.label}</h2>
        <p className="mt-1 text-sm text-muted">{slot.where}</p>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <li>
              <label className={`block cursor-pointer overflow-hidden rounded-2xl ring-2 ring-dashed ring-line hover:ring-brand ${pending ? "pointer-events-none opacity-60" : ""}`}>
                <span className="relative flex aspect-[4/3] flex-col items-center justify-center gap-1.5 bg-paper text-center text-sm font-semibold text-muted">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-brand" aria-hidden />
                      Upload a new photo
                      <span className="px-3 font-normal">JPG, PNG or WebP · up to 10 MB</span>
                    </>
                  )}
                  {busy === "__upload__" && (
                    <span className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-brand text-white">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    </span>
                  )}
                </span>
                <span className="block truncate px-2 py-1.5 text-sm font-semibold text-brand">{busy === "__upload__" ? "Uploading…" : "From your phone or computer"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={pending}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(f);
                  }}
                />
              </label>
            </li>
            {gallery.map((g) => {
              const selected = g.src === slot.current;
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => choose(g.src)}
                    aria-pressed={selected}
                    className={`block w-full overflow-hidden rounded-2xl text-left ring-2 transition ${selected ? "ring-brand" : "ring-transparent hover:ring-line"}`}
                  >
                    <span className="relative block aspect-[4/3]">
                      <Image src={g.src} alt="" fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" />
                      {(selected || busy === g.src) && (
                        <span className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-brand text-white">
                          {busy === g.src ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
                        </span>
                      )}
                    </span>
                    <span className="block truncate px-2 py-1.5 text-sm font-semibold">
                      {g.title}
                      {!g.published && <span className="ml-1 font-normal text-muted">(hidden)</span>}
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>
        <p className="mt-3 text-sm text-muted">An uploaded photo is kept in the Photo gallery as hidden, so it won’t show on “Our Home” unless you publish it there.</p>

        {msg && (
          <p role="alert" className="mt-4 font-medium text-red-700">
            {msg}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
          <button
            type="button"
            disabled={pending || isDefault}
            onClick={() => choose("")}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold text-muted hover:bg-paper disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Use the original photo
          </button>
          <button type="button" onClick={onClose} className="btn-ghost min-h-11">
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
}
