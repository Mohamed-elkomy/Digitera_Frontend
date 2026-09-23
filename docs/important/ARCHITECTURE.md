# Architecture Specification: Next.js + TypeScript

## 1. Overview
Full-featured SSR/SSG web application built with the Next.js App Router and strict TypeScript.

---

## 2. Layer Architecture & Server/Client Boundaries

### App Router Structure & Boundary Principles
- **Server Components (RSC) by Default**: Components under `src/app/` are async Server Components unless marked `'use client'`.
- **Client Components (`'use client'`)**: Restricted strictly to interactive leaves (forms, interactive widgets, modal dialogues).
- **Strong Typing**: Page and layout props typed with Next.js built-ins (`PageProps`, `Metadata`).
- **Feature-Based Modularity**: `src/features/<feature_name>/` containing components, typed services, schemas, and types.

```text
[ Browser / Client Navigation ]
               ↓
[ App Router Layouts & Pages (RSC) ] ── (Direct Typed DB / Service Access)
               ↓ (Typed Props Serialization)
   [ Client Interactive Components ('use client') ]
               ↓
     [ Typed Feature Hooks & Client Services ]
               ↓ (REST / Server Actions)
```

---

## 3. Four-Layer Validation Standard
1. **UI Layer Validation**: Inline field errors using React Hook Form.
2. **Schema Boundary Validation**: Runtime validation with Zod schemas.
3. **Domain Business Invariants**: Verified in domain service modules.
4. **Data Integrity**: Database constraints.

---

## 4. Allowed & Forbidden Patterns

### Allowed Patterns
- Direct async data fetching in typed Server Components.
- Sharing type contracts (`types.ts`) between server and client components.
- Inferred types from Zod schemas.

### Forbidden Patterns
- Using `any` type escapes.
- Adding `'use client'` to root layouts.
- Leaking private environment variables to client code.
