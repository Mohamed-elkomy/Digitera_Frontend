import { env } from "@/config/env";
import type {
  AuthUser,
  LoginValues,
  SignupValues,
} from "@/features/auth/types/auth.types";
import { nameFromEmail } from "@/features/auth/utils/auth.identity";

/** Why the server said no — each code has a sentence in both languages. */
export type AuthErrorCode =
  "invalidCredentials" | "emailTaken" | "demoLocked" | "serverError";

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}

export type AuthService = {
  /** True when accounts live in the database (not only in this browser). */
  live: boolean;
  login(values: LoginValues): Promise<AuthUser>;
  register(values: SignupValues): Promise<AuthUser>;
  logout(): Promise<void>;
  /** The server's view of the session; null when signed out. */
  me(): Promise<AuthUser | null>;
  updateProfile(user: AuthUser): Promise<AuthUser>;
};

const pause = () => new Promise((resolve) => setTimeout(resolve, 700));

/** Demo mode: accounts are kept in this browser only. */
const mockAuthService: AuthService = {
  live: false,
  async login(values) {
    await pause();
    const email = values.email.trim();
    return { email, name: nameFromEmail(email) };
  },
  async register(values) {
    await pause();
    return { name: values.name.trim(), email: values.email.trim() };
  },
  async logout() {},
  async me() {
    return null;
  },
  async updateProfile(user) {
    return user;
  },
};

async function call(
  path: string,
  init?: RequestInit,
): Promise<AuthUser | null> {
  const response = await fetch(`/api/auth/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
  });
  const body = (await response.json().catch(() => ({}))) as {
    user?: AuthUser | null;
    error?: string;
  };

  if (response.ok) return body.user ?? null;
  if (response.status === 401 && path === "me") return null;
  if (
    body.error === "invalidCredentials" ||
    body.error === "emailTaken" ||
    body.error === "demoLocked"
  ) {
    throw new AuthError(body.error);
  }
  throw new AuthError("serverError");
}

/** Live mode: accounts in the database, session in an httpOnly cookie. */
const httpAuthService: AuthService = {
  live: true,
  async login(values) {
    const user = await call("login", {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!user) throw new AuthError("serverError");
    return user;
  },
  async register(values) {
    const user = await call("register", {
      method: "POST",
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
        acceptedTerms: values.acceptedTerms,
      }),
    });
    if (!user) throw new AuthError("serverError");
    return user;
  },
  async logout() {
    await call("logout", { method: "POST" }).catch(() => null);
  },
  async me() {
    return call("me");
  },
  async updateProfile(user) {
    const updated = await call("me", {
      method: "PATCH",
      body: JSON.stringify(user),
    });
    if (!updated) throw new AuthError("serverError");
    return updated;
  },
};

export const authService: AuthService = env.useMockApi
  ? mockAuthService
  : httpAuthService;
