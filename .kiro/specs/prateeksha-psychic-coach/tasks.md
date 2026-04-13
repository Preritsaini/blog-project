# Implementation Plan: Prateeksha Psychic Coach Website

## Overview

Incremental build of the Next.js 16 App Router site with Firebase backend. Each task wires into the previous, ending with a fully integrated public + admin experience.

## Tasks

- [x] 1. Project foundation — dependencies, Firebase init, design tokens
  - Install firebase, firebase-admin, zod, fast-check, jest, @testing-library/react, @testing-library/jest-dom, react-quill (or tiptap) as dependencies
  - Create `src/lib/firebase/client.ts` — initialise Firebase client SDK from env vars
  - Create `src/lib/firebase/admin.ts` — initialise Firebase Admin SDK (server-only)
  - Add `src/app/globals.css` design tokens: color palette (deep indigo, soft gold, off-white, charcoal), typography scale, spacing scale using Tailwind CSS v4 custom properties
  - Load a serif Google Font for headings and a sans-serif font for body via Next.js font optimisation in `src/app/layout.tsx`
  - Set `NEXT_PUBLIC_SITE_URL` in `.env.local.example`
  - _Requirements: 10.1, 10.2_

- [x] 2. Shared UI components — NavBar, Footer, BlogCard, ServiceCard, SkeletonCard
  - Create `src/components/ui/NavBar.tsx` — logo/site name + links to `/blog`, `/services`, `/contact`; visible focus indicators on all links
  - Create `src/components/ui/Footer.tsx` — copyright, social links, nav links
  - Create `src/components/ui/BlogCard.tsx` — renders title, excerpt, cover image (`<Image>`), tags, formatted publishedAt date; links to `/blog/[slug]`
  - Create `src/components/ui/ServiceCard.tsx` — renders name, description, duration, price, CTA link
  - Create `src/components/ui/SkeletonCard.tsx` — skeleton loading placeholder
  - Create `src/components/ui/SubmitButton.tsx` — `useFormStatus`-aware submit button
  - Wire NavBar and Footer into `src/app/layout.tsx`; add site-level WebSite JSON-LD and `metadataBase` + title template to root metadata export
  - _Requirements: 10.3, 10.4, 10.5, 10.6, 9.6, 1.4_

  - [x] 2.1 Write unit tests for BlogCard renders all required fields
    - **Property 4: Blog post card renders all required fields**
    - **Validates: Requirements 2.2**

  - [x] 2.2 Write unit tests for ServiceCard renders all required fields
    - **Property 9: Service card renders all required fields**
    - **Validates: Requirements 4.2**

- [x] 3. Utility functions — slug generation and Zod validation schemas
  - Create `src/lib/slug.ts` — `generateSlug(title: string): string` per the design spec
  - Create `src/lib/validations.ts` — `ContactSchema`, `PostSchema`, `ServiceSchema` Zod schemas
  - _Requirements: 7.8, 5.3, 7.7, 8.7_

  - [x] 3.1 Write property test for generateSlug
    - **Property 17: Slug generation produces valid URL-safe strings**
    - **Validates: Requirements 7.8**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 17`

  - [x] 3.2 Write property tests for Zod schema validation
    - **Property 10: Valid contact submission succeeds**
    - **Property 11: Invalid contact submission returns errors**
    - **Property 16: Empty required field rejects form**
    - **Validates: Requirements 5.2, 5.3, 7.7, 8.7**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 10/11/16`

- [x] 4. Firestore data layer — posts, services, contacts query functions
  - Create `src/lib/firestore/posts.ts`:
    - `getRecentPosts(limit = 3)` — fetches published posts ordered by `publishedAt` desc, limited to 3
    - `getAllPosts()` — fetches all published posts ordered by `publishedAt` desc
    - `getPostBySlug(slug)` — fetches single published post by slug
    - `getRelatedPosts(post, limit = 3)` — returns up to 3 published posts sharing at least one tag
    - `getAllPostsAdmin()` — fetches all posts (published + draft) for admin list
    - `getPostById(id)` — fetches single post by Firestore document ID
  - Create `src/lib/firestore/services.ts`:
    - `getActiveServices()` — fetches services where `active === true`
    - `getAllServicesAdmin()` — fetches all services for admin list
    - `getServiceById(id)` — fetches single service by ID
  - Create `src/lib/firestore/contacts.ts`:
    - `saveContact(data)` — writes a `ContactSubmission` document to `contacts` collection
  - _Requirements: 1.2, 1.3, 2.1, 3.5, 4.1, 5.2_

  - [x] 4.1 Write property tests for post filtering and sorting logic
    - **Property 1: Homepage shows the three most recent published posts**
    - **Property 3: Blog listing is in reverse chronological order**
    - **Property 8: Related posts share at least one tag and are capped at three**
    - **Property 2: Only active services are displayed**
    - **Validates: Requirements 1.2, 1.3, 2.1, 3.5**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 1/2/3/8`

- [x] 5. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [x] 6. Session management and admin auth Server Actions
  - Create `src/lib/session.ts` — `createSession(idToken)`, `deleteSession()`, `verifySession()` using Firebase Admin SDK and HttpOnly session cookie
  - Create `src/actions/auth.ts` — `login(formData)` and `logout()` Server Actions; map Firebase Auth error codes to generic "Invalid email or password" message
  - Create `src/middleware.ts` — verify session cookie on every `/admin/*` request (excluding `/admin/login`); redirect to `/admin/login` on failure or missing cookie
  - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 6.1 Write property test for middleware redirect behaviour
    - **Property 12: Unauthenticated requests to /admin/* are redirected**
    - **Validates: Requirements 6.4, 6.6**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 12`

- [x] 7. Admin post and service Server Actions
  - Create `src/actions/posts.ts` — `createPost`, `updatePost`, `deletePost` Server Actions; validate with `PostSchema`; call `revalidatePath('/blog')`, `revalidatePath('/')`, `revalidatePath('/blog/[slug]')` after writes; redirect to `/admin/posts`
  - Create `src/actions/services.ts` — `createService`, `updateService`, `deleteService` Server Actions; validate with `ServiceSchema`; call `revalidatePath('/services')`, `revalidatePath('/')` after writes; redirect to `/admin/services`
  - Create `src/actions/contact.ts` — `submitContact` Server Action; validate with `ContactSchema`; call `saveContact`; return typed `ContactFormState`
  - _Requirements: 7.3, 7.5, 7.6, 7.7, 8.3, 8.5, 8.6, 8.7, 5.2, 5.3, 5.4_

  - [x] 7.1 Write property tests for post Server Action validation
    - **Property 14: Valid post form writes to Firestore and redirects**
    - **Property 16: Empty required field rejects form without writing to Firestore**
    - **Validates: Requirements 7.3, 7.5, 7.7**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 14/16`

  - [x] 7.2 Write property tests for service Server Action validation
    - **Property 18: Valid service form writes to Firestore and redirects**
    - **Validates: Requirements 8.3, 8.5, 8.7**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 18`

  - [x] 7.3 Write property tests for contact Server Action validation
    - **Property 10: Valid contact submission succeeds**
    - **Property 11: Invalid contact submission returns errors**
    - **Validates: Requirements 5.2, 5.3**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 10/11`

- [x] 8. Public pages — Homepage, Blog listing, Blog post, Services, Contact
  - Create `src/app/page.tsx` — fetch `getRecentPosts(3)` and `getActiveServices()`; render hero, about, blog preview cards, service cards; export static `metadata` with OG + Twitter tags + canonical
  - Create `src/app/blog/page.tsx` — fetch `getAllPosts()`; render all `BlogCard`s in reverse chronological order; empty state if none; export static `metadata`
  - Create `src/app/blog/[slug]/page.tsx` — fetch post by slug; call `notFound()` if missing; render cover image, title, date, tags, body HTML; render related posts; export `generateMetadata` with dynamic OG/Twitter/canonical; include JSON-LD `Article` schema
  - Create `src/app/services/page.tsx` — fetch `getActiveServices()`; render `ServiceCard`s; empty state if none; export static `metadata`; include JSON-LD `Service` schema
  - Create `src/app/contact/page.tsx` — static shell with `ContactForm` client component wired to `submitContact` Server Action via `useActionState`; inline validation errors; success message; export static `metadata`
  - Create `src/app/not-found.tsx` — branded 404 page
  - _Requirements: 1.1–1.5, 2.1–2.5, 3.1–3.5, 4.1–4.5, 5.1–5.5, 9.3, 9.4, 9.5_

  - [x] 8.1 Write property test for generateMetadata field mapping
    - **Property 6: generateMetadata maps post fields correctly**
    - **Validates: Requirements 3.2**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 6`

  - [x] 8.2 Write property test for JSON-LD Article schema builder
    - **Property 7: JSON-LD Article schema contains all required fields**
    - **Validates: Requirements 3.3, 9.7**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 7`

  - [x] 8.3 Write property test for individual post page renders all required fields
    - **Property 5: Individual post page renders all required fields**
    - **Validates: Requirements 3.1**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 5`

  - [x] 8.4 Write unit tests for empty states and 404 behaviour
    - Test blog listing empty state (Requirement 2.5)
    - Test services empty state (Requirement 4.5)
    - Test `/blog/[slug]` with unknown slug renders 404 (Requirement 3.4)

- [x] 9. SEO infrastructure — sitemap and robots
  - Create `src/app/sitemap.ts` — fetch all published post slugs; return entries for `/`, `/blog`, `/services`, `/contact`, and each `/blog/[slug]`
  - Create `src/app/robots.ts` — allow all crawlers on public routes; disallow `/admin/*`
  - _Requirements: 9.1, 9.2_

  - [x] 9.1 Write property test for sitemap completeness
    - **Property 19: Sitemap includes all public routes and all post slugs**
    - **Validates: Requirements 9.1**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 19`

  - [x] 9.2 Write property test for public page metadata completeness
    - **Property 20: Every public page metadata includes canonical URL, Open Graph, and Twitter Card fields**
    - **Validates: Requirements 9.3, 9.4, 9.5**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 20`

- [x] 10. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [x] 11. Admin login page
  - Create `src/app/admin/login/page.tsx` — email + password form; wire to `login` Server Action via `useActionState`; display auth error messages; no redirect if already authenticated (middleware handles that)
  - _Requirements: 6.1, 6.2, 6.3_

  - [x] 11.1 Write unit test for login form field presence
    - Test email field, password field, and submit button are rendered (Requirement 6.1)

- [x] 12. Admin layout and dashboard
  - Create `src/app/admin/layout.tsx` — shared admin shell with logout button wired to `logout` Server Action; renders only when session is valid (middleware already guards)
  - Create `src/app/admin/page.tsx` — dashboard landing with links to post list and service list
  - _Requirements: 6.5_

- [x] 13. Admin blog post management pages
  - Create `src/components/admin/PostEditor.tsx` — client component wrapping a rich text editor (e.g. react-quill or tiptap); controlled by parent form
  - Create `src/components/admin/ConfirmDelete.tsx` — delete confirmation dialog
  - Create `src/app/admin/posts/page.tsx` — fetch `getAllPostsAdmin()`; render table with title, publishedAt, published/draft status, Edit and Delete buttons
  - Create `src/app/admin/posts/new/page.tsx` — render post editor form wired to `createPost` Server Action; auto-generate slug from title (client-side via `generateSlug`), editable; validation errors displayed inline
  - Create `src/app/admin/posts/[id]/edit/page.tsx` — fetch post by ID; pre-populate editor form; wire to `updatePost` Server Action
  - _Requirements: 7.1–7.8_

  - [x] 13.1 Write property test for admin post list renders all posts
    - **Property 13: Admin post list renders all posts with required fields**
    - **Validates: Requirements 7.1**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 13`

  - [x] 13.2 Write property test for edit form pre-population
    - **Property 15: Edit form is pre-populated with stored data**
    - **Validates: Requirements 7.4**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 15`

  - [x] 13.3 Write unit tests for admin post form
    - Test new post form renders all required fields (Requirement 7.2)
    - Test delete action calls Firestore with correct ID (Requirement 7.6)

- [x] 14. Admin service management pages
  - Create `src/app/admin/services/page.tsx` — fetch `getAllServicesAdmin()`; render table with name, active status, Edit and Delete buttons
  - Create `src/app/admin/services/new/page.tsx` — render service form wired to `createService` Server Action; validation errors displayed inline
  - Create `src/app/admin/services/[id]/edit/page.tsx` — fetch service by ID; pre-populate form; wire to `updateService` Server Action
  - _Requirements: 8.1–8.7_

  - [x] 14.1 Write property test for edit form pre-population (services)
    - **Property 15: Edit form is pre-populated with stored data**
    - **Validates: Requirements 8.4**
    - Tag: `// Feature: prateeksha-psychic-coach, Property 15`

  - [x] 14.2 Write unit tests for admin service form
    - Test new service form renders all required fields (Requirement 8.2)
    - Test delete action calls Firestore with correct ID (Requirement 8.6)

- [x] 15. Final checkpoint — Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check with a minimum of 100 iterations per property
- Unit tests use Jest + React Testing Library
- All Firestore side effects in property/unit tests are verified via mocks; integration tests use the Firebase emulator
