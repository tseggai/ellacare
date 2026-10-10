"use client";

import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, Check, EyeOff, GripVertical, ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import type { GalleryPhoto } from "@/lib/content";
import { field, idleState } from "../ui";
import { deletePhoto, reorderPhotos, savePhoto, uploadPhoto } from "./actions";

const NEW = "__new__";

/* ───────────── Grid with drag-and-drop ordering ───────────── */

export function GalleryManager({ photos: initial, categories }: { photos: GalleryPhoto[]; categories: string[] }) {
  const [photos, setPhotos] = useState(initial);
  const [dialog, setDialog] = useState<{ mode: "add" } | { mode: "edit"; photo: GalleryPhoto } | null>(null);
  const [orderMsg, setOrderMsg] = useState<string | null>(null);
  const [, start] = useTransition();

  // Pick up the fresh list after a save/upload/delete re-renders the page.
  const [seen, setSeen] = useState(initial);
  if (seen !== initial) {
    setSeen(initial);
    setPhotos(initial);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = photos.findIndex((p) => p.id === active.id);
    const to = photos.findIndex((p) => p.id === over.id);
    const next = arrayMove(photos, from, to);
    setPhotos(next);
    setOrderMsg("Saving order…");
    start(async () => {
      const res = await reorderPhotos(next.map((p) => p.id));
      setOrderMsg(res.status === "error" ? res.message ?? "Could not save the order." : "Order saved.");
      setTimeout(() => setOrderMsg(null), 2000);
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setDialog({ mode: "add" })} className="btn-primary min-h-11">
          <ImagePlus className="h-4 w-4" aria-hidden /> Add a photo
        </button>
        <p className="text-sm text-muted" role="status">
          {orderMsg ?? `${photos.length} photo${photos.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <ImagePlus className="mx-auto h-8 w-8 text-brand" aria-hidden />
          <p className="mt-3 font-semibold">No photos yet</p>
          <p className="mt-1 text-sm text-muted">Add your first photo of the home and it will appear on the website.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((p, i) => (
                <PhotoTile key={p.id} photo={p} index={i} onOpen={() => setDialog({ mode: "edit", photo: p })} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {dialog && (
        <PhotoDialog
          key={dialog.mode === "edit" ? dialog.photo.id : "add"}
          photo={dialog.mode === "edit" ? dialog.photo : undefined}
          categories={categories}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}

function PhotoTile({ photo, index, onOpen }: { photo: GalleryPhoto; index: number; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`card relative overflow-hidden ${isDragging ? "z-20 shadow-2xl ring-2 ring-brand" : ""} ${photo.published ? "" : "opacity-70"}`}
    >
      <button type="button" onClick={onOpen} className="block w-full text-left" aria-label={`Edit ${photo.title}`}>
        <span className="relative block aspect-[4/3]">
          <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          {!photo.published && (
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 text-[0.7rem] font-bold tracking-wider text-white uppercase">
              <EyeOff className="h-3 w-3" aria-hidden /> Hidden
            </span>
          )}
        </span>
        <span className="block p-3">
          <span className="block truncate font-semibold">{photo.title}</span>
          <span className="block truncate text-sm text-muted">{photo.category}</span>
        </span>
      </button>
      <span className="pointer-events-none absolute top-2 right-11 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-muted">{index + 1}</span>
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${photo.title}`}
        className="absolute top-2 right-2 grid h-8 w-8 cursor-grab touch-none place-items-center rounded-full bg-white/90 text-ink ring-1 ring-line active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
    </li>
  );
}

/* ───────────── Add / edit dialog ───────────── */

function PhotoDialog({ photo, categories, onClose }: { photo?: GalleryPhoto; categories: string[]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const [state, action, pending] = useActionState(photo ? savePhoto : uploadPhoto, idleState);
  const [preview, setPreview] = useState<string | null>(photo?.src ?? null);
  const [step, setStep] = useState<"photo" | "details">(photo ? "details" : "photo");
  const [category, setCategory] = useState(photo?.category ?? categories[0] ?? "");
  const [deleting, startDelete] = useTransition();
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  // Close once the save has gone through.
  const done = state.status === "saved";
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onClose, 700);
    return () => clearTimeout(t);
  }, [done, onClose]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={photo ? "Edit photo" : "Add a photo"}
      className="m-auto h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-night/60 backdrop:backdrop-blur-sm sm:h-auto sm:max-h-[92dvh] sm:max-w-lg sm:p-4"
    >
      <form action={action} className="relative flex h-full flex-col overflow-y-auto bg-white px-6 pt-8 pb-8 sm:h-auto sm:rounded-4xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-paper ring-1 ring-line">
          <X className="h-5 w-5" aria-hidden />
        </button>
        {photo && <input type="hidden" name="id" value={photo.id} />}

        <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">
          {photo ? "Edit photo" : step === "photo" ? "Step 1 of 2" : "Step 2 of 2"}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {photo ? photo.title : step === "photo" ? "Choose a photo" : "Tell us about it"}
        </h2>

        {/* Step 1: the file. Kept mounted so the chosen file survives the step change. */}
        <div hidden={step !== "photo"} className="mt-6">
          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl bg-paper text-center text-sm font-semibold text-muted ring-1 ring-line hover:ring-brand">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-brand" aria-hidden />
                Tap to choose a photo
                <span className="font-normal">JPG, PNG or WebP · up to 10 MB</span>
              </>
            )}
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp"
              required={!photo}
              disabled={!!photo}
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setPreview(URL.createObjectURL(f));
                  setStep("details");
                }
              }}
            />
          </label>
          {preview && (
            <p className="mt-3 text-center text-sm text-muted">Tap the photo to choose a different one.</p>
          )}
        </div>

        {/* Step 2: name, category, visibility */}
        <div hidden={step !== "details"} className="mt-6 grid gap-4">
          {preview && (
            <button type="button" onClick={() => !photo && setStep("photo")} className="relative block aspect-[16/9] overflow-hidden rounded-2xl" disabled={!!photo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="h-full w-full object-cover" />
            </button>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">What is this a photo of?</span>
            <input name="title" required maxLength={120} defaultValue={photo?.title} placeholder="e.g. Garden patio" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Which part of the home?</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${field} appearance-none`}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value={NEW}>+ Add a new category…</option>
            </select>
          </label>
          {category === NEW ? (
            <input name="category" required maxLength={60} placeholder="New category name, e.g. Garden" className={field} autoFocus />
          ) : (
            <input type="hidden" name="category" value={category} />
          )}
          <label className="inline-flex min-h-11 items-center gap-2 font-semibold">
            <input type="checkbox" name="published" defaultChecked={photo ? photo.published : true} className="h-5 w-5 accent-brand" />
            Show on the website
          </label>
        </div>

        {(state.status !== "idle" || deleteErr) && (
          <p role="status" className={`mt-4 font-medium ${state.status === "error" || deleteErr ? "text-red-700" : "text-leaf"}`}>
            {deleteErr ?? state.message}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
          {step === "details" && !photo ? (
            <button type="button" onClick={() => setStep("photo")} className="btn px-3 text-muted hover:text-ink">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back
            </button>
          ) : photo ? (
            <button
              type="button"
              disabled={deleting}
              onClick={() => {
                if (!confirm(`Delete “${photo.title}”? This can’t be undone.`)) return;
                startDelete(async () => {
                  const res = await deletePhoto(photo.id);
                  if (res.status === "error") setDeleteErr(res.message ?? "Could not delete.");
                  else onClose();
                });
              }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Trash2 className="h-4 w-4" aria-hidden />} Delete
            </button>
          ) : (
            <span />
          )}
          {step === "details" && (
            <button type="submit" disabled={pending || done} className="btn-primary min-h-11 disabled:opacity-60">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : done ? <Check className="h-4 w-4" aria-hidden /> : null}
              {pending ? (photo ? "Saving…" : "Uploading…") : done ? "Done" : photo ? "Save changes" : "Add photo"}
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
}
