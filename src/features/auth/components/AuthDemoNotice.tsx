"use client";

import { AlertIcon } from "@/components/icons";
import { authService } from "@/features/auth/services/auth.service";
import { useI18n } from "@/lib/i18n/I18nProvider";

/**
 * Demo mode says plainly that nothing is checked, so nobody types a password
 * they really use. With a live backend accounts are real and the notice goes
 * away — except on password reset, which needs an email service to be real.
 */
export function AuthDemoNotice({ reset = false }: { reset?: boolean }) {
  const { dict } = useI18n();
  if (authService.live && !reset) return null;

  return (
    <p className="flex items-start gap-2 rounded border border-line bg-sand px-3 py-2.5 text-[11px] leading-relaxed text-muted">
      <AlertIcon size={14} className="mt-0.5 shrink-0 text-gold" />
      {authService.live ? dict.auth.resetByConcierge : dict.auth.demoNotice}
    </p>
  );
}
