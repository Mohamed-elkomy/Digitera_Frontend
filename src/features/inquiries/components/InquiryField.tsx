"use client";

import { AlertIcon } from "@/components/icons";
import type { InquiryField as Field } from "@/features/inquiries/types/inquiry.types";
import { cn } from "@/lib/utils/cn";

type InquiryFieldProps = {
  name: Field;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  multiline?: boolean;
  required?: boolean;
  className?: string;
};

export function InquiryField({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  multiline = false,
  required = false,
  className,
}: InquiryFieldProps) {
  const id = `inquiry-${name}`;
  const errorId = `${id}-error`;
  const control = cn(
    "w-full rounded border bg-surface px-3 py-3 text-[13px] text-ink outline-none transition-colors duration-300 placeholder:text-muted focus:border-gold",
    error ? "border-[#c4564a]" : "border-line",
  );
  const shared = {
    id,
    name,
    value,
    required,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    className: control,
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-[11px] font-semibold tracking-wide text-muted uppercase"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={5}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          dir={type === "text" ? "auto" : "ltr"}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error ? (
        <p
          id={errorId}
          className="flex items-center gap-1.5 text-[12px] text-[#c4564a]"
        >
          <AlertIcon size={13} />
          {error}
        </p>
      ) : null}
    </div>
  );
}
