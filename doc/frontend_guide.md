# 🚀 Frontend Development Guide — Strivio Marketplace

---

## 0. Non-Negotiable Principles (Read First)

These rules prevent future tech debt.

### Core Rules

1. **`page.tsx` = Server Component only**
2. **No business logic in UI**
3. **DRY at layout & data level**
4. **Every page SEO-ready by default**
5. **Client components only for interaction**
6. **No fetching in deeply nested components**
7. **Design → Components → Pages (in this order)**

---

## 1. Initial Setup (Correct Way)

### Project Init

```bash
npx create-next-app@latest strivio-web --app --typescript
```

### Install UI & Utils

```bash
npm install tailwindcss clsx lucide-react
npm install zod
npm install @radix-ui/react-icons
```

(Optional)

```bash
npm install framer-motion
```

---

## 2. Folder Structure (Strict)

This structure enforces DRY + scalability.

```
app/
 ├─ (public)/
 │   ├─ page.tsx           # Home
 │   ├─ marketplace/
 │   │   ├─ page.tsx
 │   │   └─ loading.tsx
 │   ├─ product/[slug]/
 │   │   ├─ page.tsx
 │   │   └─ not-found.tsx
 │
 ├─ (dashboard)/
 │   ├─ layout.tsx
 │   ├─ buyer/
 │   ├─ seller/
 │   └─ admin/
 │
 ├─ layout.tsx             # Root layout
 ├─ error.tsx
 └─ not-found.tsx

components/
 ├─ ui/                    # shadcn-level primitives
 ├─ shared/                # Navbar, Footer
 ├─ product/
 ├─ marketplace/
 ├─ dashboard/

lib/
 ├─ seo.ts
 ├─ fetchers.ts
 ├─ constants.ts
 └─ utils.ts

styles/
 └─ globals.css
```

---

## 3. `page.tsx` RULES (Very Important)

### What `page.tsx` SHOULD do

* Fetch data
* Handle SEO
* Pass props to UI components

### What it MUST NOT do

* No `useState`
* No `useEffect`
* No click handlers
* No animations

### Example (Marketplace Page)

```tsx
// app/marketplace/page.tsx
import { getMarketplaceProducts } from "@/lib/fetchers"
import { MarketplaceGrid } from "@/components/marketplace/grid"
import { generateSeo } from "@/lib/seo"

export const metadata = generateSeo({
  title: "Marketplace – Strivio",
  description: "Buy and sell digital products, scripts, templates & tools.",
})

export default async function MarketplacePage() {
  const products = await getMarketplaceProducts()

  return (
    <main className="container py-10">
      <MarketplaceGrid products={products} />
    </main>
  )
}
```

✔ Server component
✔ SEO handled
✔ Clean separation

---

## 4. SEO SYSTEM (Centralized)

### `lib/seo.ts`

```ts
import type { Metadata } from "next"

export function generateSeo({
  title,
  description,
  image,
}: {
  title: string
  description: string
  image?: string
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
    },
    twitter: {
      card: "summary_large_image",
    },
  }
}
```

### Usage

* Every `page.tsx` exports `metadata`
* No inline SEO junk

---

## 5. Data Fetching Pattern (DRY)

### `lib/fetchers.ts`

```ts
export async function getMarketplaceProducts() {
  return fetch(`${process.env.API_URL}/products`, {
    cache: "no-store",
  }).then(res => res.json())
}
```

Rules:

* **All fetching lives in `/lib`**
* Page imports fetcher
* Components receive props only

---

## 6. Component Architecture

### Component Types

| Type        | Example     | Client? |
| ----------- | ----------- | ------- |
| Layout      | Navbar      | ❌       |
| Display     | ProductCard | ❌       |
| Interactive | Filters     | ✅       |
| Forms       | Checkout    | ✅       |

---

### Product Card (Server Safe)

```tsx
export function ProductCard({ product }) {
  return (
    <div className="rounded-xl border p-4">
      <img src={product.poster} />
      <h3>{product.title}</h3>
      <p>₹{product.price}</p>
    </div>
  )
}
```

No hooks = reusable everywhere.

---

## 7. Client Components (Controlled)

### Rule

Only add `"use client"` **at the leaf node**, never high up.

### Example: Filter Sidebar

```tsx
"use client"

export function MarketplaceFilters() {
  return <button>Filter</button>
}
```

---

## 8. Layout Strategy (DRY)

### Root Layout

```tsx
// app/layout.tsx
import Navbar from "@/components/shared/navbar"
import Footer from "@/components/shared/footer"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### Dashboard Layout

```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}
```

---

## 9. Marketplace Pages Build Order (Recommended)

Build **vertically**, not horizontally.

### Phase 1 (Public)

1. Home
2. Marketplace
3. Product Detail
4. Search + Filters

### Phase 2 (Buyer)

5. Checkout UI
6. After Purchase Page
7. Downloads Page

### Phase 3 (Seller)

8. Seller Dashboard
9. Product Upload UI

### Phase 4 (Admin)

10. Admin Tables
11. Approval Screens

---

## 10. Error, Loading & Empty States

### Loading

```tsx
// app/marketplace/loading.tsx
export default function Loading() {
  return <SkeletonGrid />
}
```

### Empty

```tsx
if (!products.length) {
  return <EmptyState title="No products found" />
}
```

---

## 11. Performance Best Practices

* Use `Image` component
* Use `Suspense` only at page level
* Cache static pages with ISR
* Avoid client JS on landing pages

---

## 12. Cursor Prompt (Use This)

Paste this into Cursor **before coding**:

```
You are building the frontend of Strivio Marketplace using Next.js App Router.

Rules:
- page.tsx must be a Server Component
- SEO handled via metadata export
- No business logic in UI components
- Data fetching only in lib/fetchers
- Client components only for interaction
- Follow DRY and separation of concerns
- Clean, minimal Tailwind UI
- Production-ready code only

Build screen-by-screen as per PRD.
```

---

## 13. Golden Check Before Every Commit

Ask yourself:

* Is this page server-first?
* Can this component be reused?
* Did I accidentally add `"use client"`?
* Is SEO handled?
* Is logic leaking into UI?
