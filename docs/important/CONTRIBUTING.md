# Contributing Standards: Next.js + TypeScript

## 1. Principles
- Strict TypeScript: No `any`, strict null checks, explicit component props.
- App Router boundaries: Server Components by default; Client Components at interactive leaf nodes.
- Zero bundle leaks: Type-only imports (`import type`).

## 2. Validation Checklist
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
