"use client";

import type { InquiryType } from "./InquiryForm";
import { useInquiry } from "./InquiryProvider";

// A button that opens the inquiry overlay, pre-set to one kind of request.
export function InquiryButton({
  inquiry = "tour",
  onClick,
  children,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & { inquiry?: InquiryType }) {
  const { open } = useInquiry();
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        open(inquiry);
      }}
    >
      {children}
    </button>
  );
}
