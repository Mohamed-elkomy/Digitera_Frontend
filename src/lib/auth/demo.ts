/**
 * The shared demo account that visitors use to try the store. Anyone can
 * sign in with it, so its name and email are locked: nobody can rename it
 * and take it away from the next visitor.
 */
export const DEMO_ACCOUNT_EMAIL = "demo@odoratus.test";

export function isDemoAccount(email: string): boolean {
  return email.trim().toLowerCase() === DEMO_ACCOUNT_EMAIL;
}
