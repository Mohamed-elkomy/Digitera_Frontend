"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottleLoader } from "@/components/ui/BottleLoader";
import { useSession } from "@/features/auth/hooks/useSession";
import { useI18n } from "@/lib/i18n/I18nProvider";

type AuthGuardProps = {
  /** True when this page is for signed-in visitors only. */
  requireSession: boolean;
  redirectTo: string;
  children: React.ReactNode;
};

/**
 * Guards a page on the session. The session lives in browser storage, so the
 * check can only run on the client — until it has, the loader stands in, which
 * also keeps the server and client markup identical on the first frame.
 */
export function AuthGuard({
  requireSession,
  redirectTo,
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const { dict } = useI18n();
  const { isSignedIn, hydrated } = useSession();

  const allowed = requireSession ? isSignedIn : !isSignedIn;

  useEffect(() => {
    if (hydrated && !allowed) router.replace(redirectTo);
  }, [hydrated, allowed, redirectTo, router]);

  if (!hydrated || !allowed) {
    return <BottleLoader label={dict.common.loading} />;
  }

  return <>{children}</>;
}
