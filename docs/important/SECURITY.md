# Security Policy & Governance: Next.js + TypeScript

## 1. Overview
Defines mandatory security controls, server/client boundary defenses, and authentication policies for typed Next.js App Router applications.

---

## 2. Mandatory Security Rules
- **Private Secrets**: Secrets and database credentials must never have the `NEXT_PUBLIC_` prefix.
- **Server Action Validation**: Typed Zod schema validation on every Server Action or Route Handler.
- **Session Cookies**: Managed via secure `HttpOnly`, `SameSite=Lax/Strict` cookies.
- **Security Headers**: Standard CSP, HSTS, X-Frame-Options configured in `next.config.mjs`.
