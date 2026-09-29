"use client";

import { AlertIcon } from "@/components/icons";
import type { AuthErrorCode } from "@/features/auth/services/auth.service";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** The server's answer when it refuses a sign-in or registration. */
export function AuthFormError({ code }: { code: AuthErrorCode | null }) {
  const { dict } = useI18n();
  if (!code) return null;

  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded border border-[#c4564a]/40 px-3 py-2.5 text-[12px] leading-relaxed text-[#c4564a]"
    >
      <AlertIcon size={14} className="mt-0.5 shrink-0" />
      {dict.auth[code]}
    </p>
  );
}
