"use client";

import { X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { InquiryForm, type InquiryType } from "./InquiryForm";

const InquiryContext = createContext<{ open: (type?: InquiryType) => void }>({ open: () => {} });

export function useInquiry() {
  return useContext(InquiryContext);
}

// Site-wide inquiry overlay. Any "Book a tour" button opens it in place, so
// visitors never leave the page they were reading.
export function InquiryProvider({ children }: { children: React.ReactNode }) {
  // `key` changes on every open so the form starts fresh each time.
  const [active, setActive] = useState<{ type: InquiryType; key: number } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback((type: InquiryType = "tour") => {
    setActive((prev) => ({ type, key: (prev?.key ?? 0) + 1 }));
  }, []);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <InquiryContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label="Contact EllaCare"
        className="m-auto h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-night/60 backdrop:backdrop-blur-sm sm:h-auto sm:max-h-[92dvh] sm:max-w-2xl sm:p-4"
      >
        {active && (
          <div className="relative flex h-full flex-col overflow-y-auto bg-white px-6 pt-10 pb-8 shadow-2xl sm:h-auto sm:animate-rise sm:rounded-4xl sm:p-10">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-6 right-5 grid sm:top-4 sm:right-4 h-11 w-11 place-items-center rounded-full bg-paper text-ink ring-1 ring-line hover:bg-sky-tint"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <InquiryForm key={active.key} initialType={active.type} bare onDone={close} />
          </div>
        )}
      </dialog>
    </InquiryContext.Provider>
  );
}
