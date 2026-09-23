# SEO Guidelines: Next.js + TypeScript

## 1. Typed Next.js Metadata API
Next.js App Router provides type-safe search engine optimization via the `Metadata` interface:
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise Platform',
  description: 'Production-grade enterprise platform',
};
```

---

## 2. Technical SEO Assets
- Type-safe sitemaps via `app/sitemap.ts` (`MetadataRoute.Sitemap`).
- Robots configuration via `app/robots.ts` (`MetadataRoute.Robots`).
- Semantic HTML and single `<h1>` structure across all pages.
