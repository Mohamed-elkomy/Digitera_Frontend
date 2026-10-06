/**
 * @jest-environment node
 */
type Customer = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};
const customers = new Map<string, Customer>();
const startSession = jest.fn();
const updateCustomer = jest.fn();
let sessionUser: { id: string; name: string; email: string } | null = null;

jest.mock("@/lib/sanity/client", () => ({
  isSanityConfigured: () => true,
  serverToken: () => "token",
}));
jest.mock("@/features/auth/server", () => ({
  normalizeEmail: (email: string) => email.trim().toLowerCase(),
  findCustomerByEmail: async (email: string) =>
    customers.get(email.trim().toLowerCase()) ?? null,
  createCustomer: async (input: Omit<Customer, "id">) => {
    const record = {
      ...input,
      id: `customer-${customers.size + 1}`,
      email: input.email.toLowerCase(),
    };
    customers.set(record.email, record);
    return record;
  },
  startSession: (...args: unknown[]) => startSession(...args),
  getSessionUser: async () => sessionUser,
  updateCustomer: (...args: unknown[]) => updateCustomer(...args),
}));

import { POST as login } from "@/app/api/auth/login/route";
import { PATCH as updateProfile } from "@/app/api/auth/me/route";
import { POST as register } from "@/app/api/auth/register/route";

const post = (body: unknown) =>
  new Request("http://localhost/api", {
    method: "POST",
    body: JSON.stringify(body),
  });

const signup = {
  name: "Salma Hassan",
  email: "Salma@Example.com",
  password: "Odoratus2026!",
  acceptedTerms: true,
};

beforeAll(() => {
  process.env.AUTH_SECRET = "s".repeat(40);
});

describe("accounts", () => {
  it("registers a customer, stores only a hash and starts a session", async () => {
    const response = await register(post(signup));
    expect(response.status).toBe(201);
    const stored = customers.get("salma@example.com")!;
    expect(stored.passwordHash).toMatch(/^scrypt\$/);
    expect(stored.passwordHash).not.toContain(signup.password);
    expect(startSession).toHaveBeenCalledWith(
      expect.objectContaining({ email: "salma@example.com" }),
    );
  });

  it("refuses a second account with the same email", async () => {
    expect(
      (await register(post({ ...signup, email: "salma@example.com" }))).status,
    ).toBe(409);
  });

  it("refuses a weak password or missing terms", async () => {
    expect(
      (
        await register(
          post({ ...signup, email: "b@example.com", password: "short" }),
        )
      ).status,
    ).toBe(422);
    expect(
      (
        await register(
          post({ ...signup, email: "c@example.com", acceptedTerms: false }),
        )
      ).status,
    ).toBe(422);
  });

  it("signs in with the right password only, with one answer for both failures", async () => {
    expect(
      (
        await login(
          post({ email: "salma@example.com", password: "Odoratus2026!" }),
        )
      ).status,
    ).toBe(200);
    const wrong = await login(
      post({ email: "salma@example.com", password: "nope" }),
    );
    const unknown = await login(
      post({ email: "nobody@example.com", password: "nope" }),
    );
    expect(wrong.status).toBe(401);
    expect(await wrong.json()).toEqual(await unknown.json());
  });
});

describe("shared demo account", () => {
  const patch = (body: unknown) =>
    new Request("http://localhost/api", {
      method: "PATCH",
      body: JSON.stringify(body),
    });

  it("refuses to rename the demo account", async () => {
    sessionUser = { id: "demo", name: "Demo", email: "demo@odoratus.test" };
    const response = await updateProfile(
      patch({ name: "Taken", email: "mine@example.com" }),
    );
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "demoLocked" });
    expect(updateCustomer).not.toHaveBeenCalled();
  });

  it("still lets a normal customer edit their profile", async () => {
    sessionUser = { id: "c1", name: "Salma", email: "salma@example.com" };
    const response = await updateProfile(
      patch({ name: "Salma Hassan", email: "salma@example.com" }),
    );
    expect(response.status).toBe(200);
    expect(updateCustomer).toHaveBeenCalledWith("c1", {
      name: "Salma Hassan",
      email: "salma@example.com",
    });
  });
});
