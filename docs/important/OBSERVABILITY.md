# Observability & Monitoring: Next.js + TypeScript

## 1. Error Telemetry
- **App Router Error Boundaries**: Typed `error.tsx` in route segments receiving `error: Error & { digest?: string }` and `reset: () => void`.
- **Global Error Handling**: `app/global-error.tsx` for root layout boundaries.
- **Structured Error Logging**: Log server-side rendering errors with request headers, path, and user session context.
