# AI Governance & Guardrails: Next.js + TypeScript

## 1. Behavioral Directives

### MUST
* **MUST** inspect existing starter files, schemas, and contracts before modifying code.
* **MUST** create or update `implementation_plan.md` before making changes across multiple files.
* **MUST** follow the 7-step phase execution loop: `Inspect → Plan → Implement → Validate → Review → Report → Checkpoint`.
* **MUST** enforce layer separation specific to frontend-next-ts.
* **MUST** run all validation commands (`npm run lint`, `npm run test`, `npm run build`) and achieve 100% success before declaring completion.

### NEVER
* **NEVER** introduce unapproved architectural changes or frameworks.
* **NEVER** add third-party NPM packages without documented justification based on bundle size, security, and necessity.
* **NEVER** bypass schema validation or security boundaries.
* **NEVER** treat frontend permission checks as backend security enforcement.
* **NEVER** put raw API fetching logic inside presentational JSX components.
* **NEVER** mark a task complete if linting, tests, type checks, or builds fail.

## 2. Component LOC Review Threshold (~200 LOC)
~200 LOC per file is a **REVIEW THRESHOLD**, not a hard limit.
When a component file exceeds ~200 LOC:
1. Analyze its responsibilities.
2. Extract state logic into custom hooks.
3. Extract reusable subcomponents via composition.
4. Extract pure calculations into testable utility functions.
5. Do **NOT** split components blindly if it damages component cohesion.
