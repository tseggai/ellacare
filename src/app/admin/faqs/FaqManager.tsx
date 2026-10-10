"use client";

import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, ChevronRight, EyeOff, GripVertical, Loader2, MessageCircleQuestion, Plus, Trash2, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import type { Faq } from "@/lib/content";
import { field, idleState } from "../ui";
import { deleteFaq, reorderFaqs, saveFaq } from "./actions";

/* ───────────── List with drag-and-drop ordering ───────────── */

export function FaqManager({ faqs: initial, draftQuestion }: { faqs: Faq[]; draftQuestion?: string }) {
  const [faqs, setFaqs] = useState(initial);
  const [dialog, setDialog] = useState<{ mode: "add"; question?: string } | { mode: "edit"; faq: Faq } | null>(
    draftQuestion ? { mode: "add", question: draftQuestion } : null,
  );
  const [orderMsg, setOrderMsg] = useState<string | null>(null);
  const [, start] = useTransition();

  // Pick up the fresh list after a save/delete re-renders the page.
  const [seen, setSeen] = useState(initial);
  if (seen !== initial) {
    setSeen(initial);
    setFaqs(initial);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const next = arrayMove(faqs, faqs.findIndex((f) => f.id === active.id), faqs.findIndex((f) => f.id === over.id));
    setFaqs(next);
    setOrderMsg("Saving order…");
    start(async () => {
      const res = await reorderFaqs(next.map((f) => f.id));
      setOrderMsg(res.status === "error" ? (res.message ?? "Could not save the order.") : "Order saved.");
      setTimeout(() => setOrderMsg(null), 2000);
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setDialog({ mode: "add" })} className="btn-primary min-h-11">
          <Plus className="h-4 w-4" aria-hidden /> Add a question
        </button>
        <p className="text-sm text-muted" role="status">
          {orderMsg ?? `${faqs.length} question${faqs.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {faqs.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <MessageCircleQuestion className="mx-auto h-8 w-8 text-brand" aria-hidden />
          <p className="mt-3 font-semibold">No questions yet</p>
          <p className="mt-1 text-sm text-muted">Add the questions families ask most, with your answers.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={faqs.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <ol className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-2">
              {faqs.map((f, i) => (
                <FaqRow key={f.id} faq={f} index={i} onOpen={() => setDialog({ mode: "edit", faq: f })} />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}

      {dialog && (
        <FaqDialog
          key={dialog.mode === "edit" ? dialog.faq.id : "add"}
          faq={dialog.mode === "edit" ? dialog.faq : undefined}
          initialQuestion={dialog.mode === "add" ? dialog.question : undefined}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}

function FaqRow({ faq, index, onOpen }: { faq: Faq; index: number; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: faq.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`card flex min-w-0 items-center gap-2 pr-2 pl-3 ${isDragging ? "z-20 shadow-2xl ring-2 ring-brand" : ""} ${faq.published ? "" : "opacity-70"}`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder: ${faq.question}`}
        className="grid h-10 w-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted hover:bg-paper active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
      <span className="w-6 shrink-0 text-sm font-bold text-muted">{index + 1}</span>
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 py-3 text-left" aria-label={`Edit: ${faq.question}`}>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{faq.question}</span>
          <span className="block truncate text-sm text-muted">{faq.answer}</span>
        </span>
        {!faq.published && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 text-[0.7rem] font-bold tracking-wider text-white uppercase">
            <EyeOff className="h-3 w-3" aria-hidden /> Hidden
          </span>
        )}
        <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden />
      </button>
    </li>
  );
}

/* ───────────── Add / edit dialog ───────────── */

function FaqDialog({ faq, initialQuestion, onClose }: { faq?: Faq; initialQuestion?: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const [state, action, pending] = useActionState(saveFaq, idleState);
  const [deleting, startDelete] = useTransition();
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

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
      aria-label={faq ? "Edit question" : "Add a question"}
      className="m-auto h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-night/60 backdrop:backdrop-blur-sm sm:h-auto sm:max-h-[92dvh] sm:max-w-lg sm:p-4"
    >
      <form action={action} className="relative flex h-full flex-col overflow-y-auto bg-white px-6 pt-8 pb-8 sm:h-auto sm:rounded-4xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-paper ring-1 ring-line">
          <X className="h-5 w-5" aria-hidden />
        </button>
        {faq && <input type="hidden" name="id" value={faq.id} />}

        <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">{faq ? "Edit question" : "New question"}</p>
        <h2 className="mt-1 pr-12 text-2xl font-semibold tracking-tight">{faq ? "Update the answer" : "Add a common question"}</h2>
        {initialQuestion && !faq && (
          <p className="mt-3 rounded-2xl bg-sky-tint p-3 text-sm">A visitor asked this. Write the answer and it joins the FAQ.</p>
        )}

        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">The question, as a family would ask it</span>
            <input
              name="question"
              required
              maxLength={300}
              defaultValue={faq?.question ?? initialQuestion}
              placeholder="e.g. Do you accept Medicaid?"
              className={field}
              autoFocus={!faq && !initialQuestion}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Your answer</span>
            <textarea
              name="answer"
              required
              rows={6}
              maxLength={3000}
              defaultValue={faq?.answer}
              placeholder="Keep it short and friendly. A few sentences is plenty."
              className={field}
              autoFocus={!!initialQuestion}
            />
          </label>
          <label className="inline-flex min-h-11 items-center gap-2 font-semibold">
            <input type="checkbox" name="published" defaultChecked={faq ? faq.published : true} className="h-5 w-5 accent-brand" />
            Show on the website
          </label>
        </div>

        {(state.status !== "idle" || deleteErr) && (
          <p role="status" className={`mt-4 font-medium ${state.status === "error" || deleteErr ? "text-red-700" : "text-leaf"}`}>
            {deleteErr ?? state.message}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
          {faq ? (
            <button
              type="button"
              disabled={deleting}
              onClick={() => {
                if (!confirm("Delete this question? This can’t be undone.")) return;
                startDelete(async () => {
                  const res = await deleteFaq(faq.id);
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
          <button type="submit" disabled={pending || done} className="btn-primary min-h-11 disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : done ? <Check className="h-4 w-4" aria-hidden /> : null}
            {pending ? "Saving…" : done ? "Done" : faq ? "Save changes" : "Add question"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
