"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

function subscribe(onChange: () => void) {
  return useAuthStore.persist.onFinishHydration(onChange);
}

/**
 * The session is restored from browser storage after the first paint. Anything
 * that renders differently for a signed-in visitor must wait for this, or the
 * server and client markup disagree on the very first frame.
 */
export function useSessionHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}

let checkedWithServer = false;

/**
 * With a live backend the httpOnly cookie is the real session; the stored
 * copy only paints the header quickly. Once per page load, ask the server who
 * is signed in and correct the copy (expired cookie, signed out elsewhere…).
 */
function checkWithServerOnce() {
  if (checkedWithServer || !authService.live) return;
  checkedWithServer = true;
  authService
    .me()
    .then((user) => {
      const { signIn, signOut } = useAuthStore.getState();
      if (user) signIn(user);
      else signOut();
    })
    .catch(() => {
      checkedWithServer = false;
    });
}

export function useSession() {
  const stored = useAuthStore((state) => state.user);
  const signIn = useAuthStore((state) => state.signIn);
  const clear = useAuthStore((state) => state.signOut);
  const hydrated = useSessionHydrated();

  useEffect(() => {
    if (hydrated) checkWithServerOnce();
  }, [hydrated]);

  const signOut = useCallback(() => {
    clear();
    void authService.logout();
  }, [clear]);

  // Before hydration, render as signed out — that is what the server sent.
  const user = hydrated ? stored : null;

  return { user, isSignedIn: Boolean(user), hydrated, signIn, signOut };
}
