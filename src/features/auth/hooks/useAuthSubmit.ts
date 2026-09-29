"use client";

import { useCallback, useState } from "react";
import {
  AuthError,
  type AuthErrorCode,
} from "@/features/auth/services/auth.service";
import type { SubmitStatus } from "@/features/auth/types/auth.types";

/**
 * Runs one auth request and tracks its state for the button and the live
 * region. A refusal from the server becomes an error code the form shows in
 * the active language.
 */
export function useAuthSubmit() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<AuthErrorCode | null>(null);

  const submit = useCallback(async (task: () => Promise<void>) => {
    setStatus("submitting");
    setError(null);
    try {
      await task();
      setStatus("success");
    } catch (caught) {
      setError(caught instanceof AuthError ? caught.code : "serverError");
      setStatus("idle");
    }
  }, []);

  return { status, error, submit };
}
