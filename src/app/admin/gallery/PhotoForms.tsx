"use client";

import { Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";
import type { GalleryPhoto } from "@/lib/content";
import { Field, field, idleState } from "../ui";
import { deletePhoto, savePhoto, uploadPhoto } from "./actions";

function CategoryInput({ categories, value }: { categories: string[]; value?: string }) {
  return (
    <>
      <input name="category" list="gallery-categories" required maxLength={60} defaultValue={value ?? categories[0] ?? ""} className={field} />
      <datalist id="gallery-categories">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </>
  );
}

function Status({ state }: { state: { status: string; message?: string } }) {
  if (state.status === "idle") return null;
  return (
    <p role="status" className={state.status === "error" ? "font-medium text-red-700" : "font-medium text-leaf"}>
      {state.message}
    </p>
  );
}

export function UploadForm({ categories }: { categories: string[] }) {
  const [state, action, pending] = useActionState(uploadPhoto, idleState);
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-[12rem_1fr]">
      <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-paper text-center text-sm font-semibold text-muted ring-1 ring-line hover:ring-brand">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <>
            <Upload className="h-6 w-6 text-brand" aria-hidden />
            Choose a photo
            <span className="font-normal">JPG, PNG or WebP · up to 10 MB</span>
          </>
        )}
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setPreview(f ? URL.createObjectURL(f) : null);
          }}
        />
      </label>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input name="title" required maxLength={120} placeholder="e.g. Garden patio" className={field} />
          </Field>
          <Field label="Category">
            <CategoryInput categories={categories} />
          </Field>
        </div>
        <div className="flex flex-wrap items-end gap-5">
          <Field label="Order" hint="lowest first">
            <input name="sort_order" type="number" min={0} defaultValue={100} className={`${field} w-28`} />
          </Field>
          <label className="inline-flex min-h-11 items-center gap-2 font-semibold">
            <input type="checkbox" name="published" defaultChecked className="h-5 w-5 accent-brand" />
            Published
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending} className="btn-primary min-h-11 disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
            {pending ? "Uploading…" : "Upload photo"}
          </button>
          <Status state={state} />
        </div>
      </div>
    </form>
  );
}

export function PhotoCard({ photo, categories }: { photo: GalleryPhoto; categories: string[] }) {
  const [state, action, pending] = useActionState(savePhoto, idleState);
  return (
    <li className={`card overflow-hidden ${photo.published ? "" : "opacity-70"}`}>
      <div className="relative aspect-[4/3]">
        <Image src={photo.src} alt={photo.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold tracking-wider uppercase ${photo.published ? "bg-white/90 text-leaf" : "bg-ink/80 text-white"}`}>
          {photo.published ? "Published" : "Hidden"}
        </span>
      </div>
      <form action={action} className="grid gap-3 p-4">
        <input type="hidden" name="id" value={photo.id} />
        <Field label="Title">
          <input name="title" required maxLength={120} defaultValue={photo.title} className={field} />
        </Field>
        <Field label="Category">
          <CategoryInput categories={categories} value={photo.category} />
        </Field>
        <div className="flex flex-wrap items-end gap-4">
          <Field label="Order">
            <input name="sort_order" type="number" min={0} defaultValue={photo.sort_order} className={`${field} w-24`} />
          </Field>
          <label className="inline-flex min-h-11 items-center gap-2 font-semibold">
            <input type="checkbox" name="published" defaultChecked={photo.published} className="h-5 w-5 accent-brand" />
            Published
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" disabled={pending} className="btn-primary min-h-10 px-4 text-sm disabled:opacity-60">
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="submit"
            formAction={deletePhoto}
            formNoValidate
            onClick={(e) => {
              if (!confirm(`Delete “${photo.title}”? This can’t be undone.`)) e.preventDefault();
            }}
            className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden /> Delete
          </button>
        </div>
        <Status state={state} />
      </form>
    </li>
  );
}
