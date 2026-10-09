"use client";

import { Check } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

// Touch devices (phones, tablets) can place a call, so the number is a tel: link
// there. On desktops a tel: link just pops an "Open Skype/FaceTime?" prompt, so
// the number becomes a button that copies it to the clipboard instead.
function subscribe(cb: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getTouch = () => window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
const getServerTouch = () => true; // render the link on the server; corrected after hydration

export function PhoneLink({
  tel,
  display,
  children,
  className,
  ...rest
}: {
  tel: string;
  display: string;
  label?: string; // accepted so `{...site.phones.main}` can be spread; not rendered
  children?: React.ReactNode;
  className?: string;
  tabIndex?: number;
}) {
  const touch = useSyncExternalStore(subscribe, getTouch, getServerTouch);
  const [copied, setCopied] = useState(false);

  if (touch) {
    return (
      <a href={`tel:${tel}`} className={className} {...rest}>
        {children ?? display}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      title={`Copy ${display}`}
      aria-label={`Copy phone number ${display}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(display);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard unavailable (e.g. insecure context); the number is still visible.
        }
      }}
      {...rest}
    >
      {copied ? (
        <span className="inline-flex items-center gap-1.5" aria-live="polite">
          <Check className="h-4 w-4" aria-hidden /> Copied
        </span>
      ) : (
        (children ?? display)
      )}
    </button>
  );
}
