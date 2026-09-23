# Performance & Caching Standards: Next.js + TypeScript

## 1. Core Web Vitals Targets
- LCP < 1.8s | INP < 80ms | CLS < 0.05

---

## 2. Next.js App Router Optimization Rules
- **Image Optimization**: Use typed `<Image />` from `next/image`.
- **Font Optimization**: Use `next/font/google`.
- **Data Caching**: Utilize `fetch` cache options (`{ next: { revalidate: 60 } }`).
- **Streaming**: Wrap async data waterfalls in `<Suspense fallback={<Skeleton />}>`.
