# AI Workflow Engine: Next.js + TypeScript

## 1. Execution Lifecycle
```text
Inspect ──> Plan ──> Implement ──> Validate ──> Review ──> Report ──> Checkpoint
```

---

## 2. Guardrails
- **Inspect**: Examine route structure, server/client boundaries, and types.
- **Plan**: Design Server Component vs Client Component split in `implementation_plan.md`.
- **Implement**: Strict TypeScript, ~200 LOC threshold, Zod inference.
- **Validate**:
  ```bash
  npm run typecheck
  npm run lint
  npm run test
  npm run build
  ```
- **Review & Checkpoint**: Verify zero type errors or bundle leaks.
