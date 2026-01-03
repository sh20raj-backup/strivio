Below is the **complete Technical Architecture & Engineering Design Document** for **Strivio Marketplace**.
This is written so it can be handed directly to **developers, Cursor, or investors** and used as a build blueprint.

---

# ⚙️ Strivio Marketplace – Technical Design Document

**Product:** Multi-Vendor Digital Marketplace
**Domain:** [https://strivio.world](https://strivio.world)
**Architecture:** Modular, scalable, self-hosted
**Primary Constraint:** Own payment gateway + secure digital delivery

---

## 1. System Architecture (High Level)

```
Browser (Web / Mobile)
        ↓
Next.js App Router (Frontend + Server Actions)
        ↓
API Layer (Internal + Webhooks)
        ↓
Database (Postgres)
        ↓
Storage (Private Object Storage)
        ↓
Payment Gateway (Webhooks)
```

---

## 2. Tech Stack (Final)

### Frontend

* Next.js (App Router)
* React Server Components
* Tailwind CSS
* shadcn/ui
* Zod (form validation)
* Framer Motion (optional)

### Backend

* Next.js Server Actions + Route Handlers
* Node.js runtime
* Webhooks (Payments)
* Secure token-based access

### Database

* PostgreSQL
* ORM: Prisma **or** Drizzle

### Auth

* Stack Auth (Open Source)
* Managed User Management
* RBAC (role-based access control)

### Payments

* Dodo Payments (Merchant of Record)
* Server-side verification
* Webhooks mandatory

### Storage

* Cloudflare R2 / AWS S3
* Private buckets
* Signed URLs

### Infrastructure

* Vercel / Cloudflare Pages
* Cloudflare Workers (optional for downloads)
* Cron jobs (cleanup, payouts)

---

## 3. Monorepo Structure

```
/apps
  /web (Next.js frontend)
  /api (optional separated backend)
  
/packages
  /ui (shared UI components)
  /config (env, constants)
  /auth (rbac, helpers)
  /payments
  /storage
  /email

/prisma
  schema.prisma
  migrations

/public
/scripts
```

---

## 4. Core Domain Models (Database Schema)

### User

```ts
User {
  id
  name
  email
  passwordHash
  role: BUYER | SELLER | ADMIN
  isBlocked
  createdAt
}
```

### SellerProfile

```ts
SellerProfile {
  id
  userId
  storeName
  bio
  kycStatus
  commissionRate
  approvedByAdmin
}
```

### Product

```ts
Product {
  id
  sellerId
  title
  slug
  description
  price
  currency
  categoryId
  status: DRAFT | PENDING | APPROVED | REJECTED
  isFeatured
  createdAt
}
```

### ProductMedia

```ts
ProductMedia {
  id
  productId
  type: POSTER | SCREENSHOT | VIDEO
  url
}
```

### ProductFile

```ts
ProductFile {
  id
  productId
  storageKey
  fileSize
  checksum
}
```

### Order

```ts
Order {
  id
  userId
  totalAmount
  paymentStatus
  gatewayOrderId
  createdAt
}
```

### OrderItem

```ts
OrderItem {
  id
  orderId
  productId
  sellerId
  price
}
```

### DownloadToken

```ts
DownloadToken {
  id
  userId
  productId
  token
  expiresAt
  downloadCount
}
```

---

## 5. Authentication & Authorization

### Roles

* BUYER
* SELLER
* ADMIN

### RBAC Middleware

```ts
requireRole(["ADMIN"])
requireOwnership(resource)
```

### Protected Routes

* `/dashboard/*`
* `/admin/*`
* `/seller/*`
* `/download/*`

---

## 6. Product Upload & Approval Flow

```
Seller → Create Product
       → Upload Media
       → Upload ZIP
       → Submit for Review
            ↓
         Admin Review
       ↙              ↘
  Approved           Rejected
   ↓                  ↓
Visible             Feedback
```

### Security

* ZIP uploaded to private storage
* Product not public until approved
* Admin-only toggle for visibility

---

## 7. Payment Architecture (Critical)

### Payment Flow

```
Client → Create Order
Server → Create Gateway Order
Client → Pay
Gateway → Webhook → Server
Server → Verify → Create Order
Server → Grant Access
```

### Webhook Rules

* Must verify signature
* Idempotent handling
* Never trust client success

---

## 8. Digital Download Security

### Strategy

* No public file URLs
* Time-limited signed URLs
* Token-based validation

### Download Flow

```
User → /download/{token}
Server → Validate token
Server → Generate signed URL
User → Download ZIP
```

### Anti-Piracy

* Max download count
* Token expiry
* Optional watermark inside ZIP

---

## 9. After Purchase Page Logic

* Server checks:

  * Order ownership
  * Payment status
* Generates fresh download token
* Displays invoice
* Logs access

---

## 10. Seller Earnings & Commission

### Revenue Split

```ts
sellerEarning = price - platformCommission
```

### Stored Per Order Item

* Seller ID
* Commission %
* Net payout

### Payout Options

* Manual (initial)
* Automated cron (v2)

---

## 11. Admin Panel Architecture

### Admin Pages

```
/admin/dashboard
/admin/users
/admin/sellers
/admin/products
/admin/orders
/admin/payouts
```

### Admin Capabilities

* Approve sellers
* Review products
* Feature products
* Disable users
* Trigger refunds

---

## 12. Feed & Discovery Algorithm

### Signals

* Recent sales
* Featured flag
* CreatedAt
* Views

### Query Example

```sql
ORDER BY isFeatured DESC, sales DESC, createdAt DESC
```

---

## 13. Search & Filtering

### Strategy

* Postgres full-text search
* Indexed category & tags
* Optional Meilisearch (v2)

---

## 14. Email System

### Triggers

* Purchase confirmation
* Download link
* Seller approval
* Product rejection
* Payout notice

### Stack

* Resend / SES
* Queue-based sending

---

## 15. Background Jobs

| Job               | Purpose           |
| ----------------- | ----------------- |
| Cleanup tokens    | Expired downloads |
| Payout processing | Seller payments   |
| Analytics sync    | Stats             |
| Storage audit     | File validation   |

---

## 16. SEO & Performance

* ISR for product pages
* Edge caching
* Sitemap auto-gen
* OpenGraph images
* Structured data

---

## 17. Security Checklist

* Webhook signature validation
* Rate limiting
* File type validation
* CSRF protection
* SQL injection safe ORM
* RBAC everywhere

---

## 18. Deployment Strategy

### Environments

* Dev
* Staging
* Production

### Secrets

* Payment keys
* Webhook secrets
* Storage keys
* JWT secret

---

## 19. Scaling Plan

| Phase      | Strategy       |
| ---------- | -------------- |
| MVP        | Monolith       |
| Growth     | Edge downloads |
| Scale      | Microservices  |
| Enterprise | Multi-region   |

---

## 20. Failure Scenarios

| Failure                        | Handling         |
| ------------------------------ | ---------------- |
| Payment success but no webhook | Manual reconcile |
| File deleted                   | Admin restore    |
| Double webhook                 | Idempotency      |
| Seller fraud                   | Account freeze   |

---

## 21. Build Order (Recommended)

1. Auth + RBAC
2. Product CRUD
3. File storage
4. Payments
5. Orders + Downloads
6. Admin panel
7. Seller dashboard
8. Feed + SEO

---

## 22. What This Enables

* Full ownership (no Gumroad dependency)
* Infinite scalability
* Multi-vendor expansion
* SaaS licensing later
* API product delivery later

---

### If you want next (pick one):

1. **Exact Prisma schema**
2. **API route contracts**
3. **Next.js folder structure**
4. **Admin panel UI wireframe**
5. **Cursor prompt to generate entire codebase**

Say the number.
