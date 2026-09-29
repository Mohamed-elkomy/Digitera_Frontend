/**
 * @jest-environment node
 */
import { createSessionToken, readSessionToken } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

const user = { id: "customer-1", name: "Salma", email: "salma@example.com" };

beforeAll(() => {
  process.env.AUTH_SECRET = "x".repeat(40);
});

describe("session token", () => {
  it("round-trips a signed session", () => {
    expect(readSessionToken(createSessionToken(user))).toEqual(user);
  });

  it("rejects a tampered payload", () => {
    const [, signature] = createSessionToken(user).split(".");
    const forged = Buffer.from(
      JSON.stringify({ ...user, id: "admin", exp: Date.now() + 1e9 }),
    ).toString("base64url");
    expect(readSessionToken(`${forged}.${signature}`)).toBeNull();
  });

  it("rejects an expired session", () => {
    const token = createSessionToken(user, Date.now() - 40 * 86_400_000);
    expect(readSessionToken(token)).toBeNull();
  });
});

describe("password hashing", () => {
  it("verifies the right password and rejects a wrong one", async () => {
    const stored = await hashPassword("Odoratus2026!");
    expect(stored.startsWith("scrypt$")).toBe(true);
    expect(stored).not.toContain("Odoratus2026!");
    await expect(verifyPassword("Odoratus2026!", stored)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", stored)).resolves.toBe(false);
  });
});
