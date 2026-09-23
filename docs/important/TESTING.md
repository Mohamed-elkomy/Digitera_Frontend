# Testing Strategy: Next.js + TypeScript

## 1. Philosophy
- **TypeScript Static Verification**: `npm run typecheck` across all App Router routes.
- **Server Component Tests**: Validate semantic HTML output from async components.
- **Client Component Tests**: RTL + user-event testing for interactive leaf components.

---

## 2. Tools & Execution
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
