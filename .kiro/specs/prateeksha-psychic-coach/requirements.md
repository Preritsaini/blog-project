# Requirements Document

## Introduction

Prateeksha is a complete end-to-end psychic coaching website built with Next.js (App Router) and Firebase as the backend/database. The site serves as a digital presence for a psychic coach, offering a minimalist, visually refined experience across two primary pillars: a blogging section for thought leadership and spiritual content, and a consultancy/coaching services section for client engagement. The site is fully mobile-responsive and optimized for search engine discoverability.

## Glossary

- **Website**: The Prateeksha Next.js application served to end users.
- **Admin**: The authenticated site owner/psychic coach who manages content and services.
- **Visitor**: An unauthenticated user browsing the public-facing website.
- **Blog_Post**: A piece of written content authored by the Admin, stored in Firestore, with a title, slug, body, cover image, excerpt, tags, and published date.
- **Service**: A coaching or consultancy offering defined by the Admin, with a name, description, duration, price, and booking link or contact method.
- **Firestore**: The Firebase Cloud Firestore database used to persist Blog_Posts, Services, and contact form submissions.
- **Firebase_Auth**: Firebase Authentication used to verify the Admin's identity.
- **Slug**: A URL-safe, human-readable string derived from a Blog_Post title, used as the unique URL segment for that post.
- **SEO_Metadata**: Structured data including title, description, Open Graph tags, Twitter Card tags, canonical URL, and JSON-LD schema attached to each page.
- **Sitemap**: An XML document listing all public URLs of the Website, generated dynamically by the Website.
- **Robots_File**: A `robots.txt` file that instructs search engine crawlers which pages to index.
- **Contact_Form**: A form on the Website that Visitors use to send inquiries to the Admin.
- **Rich_Text_Editor**: A client-side WYSIWYG editor used by the Admin to compose Blog_Post body content.
- **Admin_Dashboard**: A protected section of the Website accessible only to the Admin, used to manage Blog_Posts and Services.

---

## Requirements

### Requirement 1: Public Homepage

**User Story:** As a Visitor, I want to see a compelling homepage that communicates who Prateeksha is and what she offers, so that I can quickly understand the value of her coaching services.

#### Acceptance Criteria

1. THE Website SHALL render a homepage at the `/` route that includes a hero section, a brief about section, a preview of recent Blog_Posts, and a preview of available Services.
2. WHEN the homepage is rendered, THE Website SHALL display the three most recently published Blog_Posts as preview cards showing title, excerpt, cover image, and published date.
3. WHEN the homepage is rendered, THE Website SHALL display all active Services as summary cards showing name, short description, and a call-to-action link.
4. THE Website SHALL export static SEO_Metadata for the homepage including a title, meta description, Open Graph title, Open Graph description, and Open Graph image.
5. THE Website SHALL render the homepage with a layout that is fully responsive across viewport widths from 320px to 2560px.

---

### Requirement 2: Blog Listing Page

**User Story:** As a Visitor, I want to browse all published blog posts in one place, so that I can discover content relevant to my spiritual journey.

#### Acceptance Criteria

1. THE Website SHALL render a blog listing page at the `/blog` route displaying all published Blog_Posts in reverse chronological order.
2. WHEN a Blog_Post is displayed on the listing page, THE Website SHALL show the post's cover image, title, excerpt, tags, and published date.
3. WHEN a Visitor clicks a Blog_Post card, THE Website SHALL navigate to the individual Blog_Post page at `/blog/[slug]`.
4. THE Website SHALL export static SEO_Metadata for the `/blog` route including a title and meta description relevant to the blog section.
5. IF no Blog_Posts exist in Firestore, THEN THE Website SHALL display a message indicating that no posts are available yet.

---

### Requirement 3: Individual Blog Post Page

**User Story:** As a Visitor, I want to read a full blog post, so that I can engage deeply with the psychic coach's content.

#### Acceptance Criteria

1. THE Website SHALL render an individual Blog_Post page at `/blog/[slug]` displaying the post's cover image, title, published date, tags, and full body content.
2. WHEN a Blog_Post page is rendered, THE Website SHALL export dynamic SEO_Metadata using `generateMetadata`, including the post's title, excerpt as meta description, cover image as Open Graph image, and canonical URL.
3. THE Website SHALL generate a JSON-LD `Article` schema for each Blog_Post page to improve structured data indexing.
4. WHEN a Visitor navigates to a `/blog/[slug]` URL that does not correspond to any published Blog_Post, THE Website SHALL render a 404 not-found page.
5. THE Website SHALL render related Blog_Posts at the bottom of each post page, showing up to three posts that share at least one tag with the current post.

---

### Requirement 4: Services / Coaching Page

**User Story:** As a Visitor, I want to view all available coaching and consultancy services with clear details, so that I can decide which service suits my needs.

#### Acceptance Criteria

1. THE Website SHALL render a services page at the `/services` route displaying all active Services fetched from Firestore.
2. WHEN a Service is displayed, THE Website SHALL show the service name, full description, duration, price, and a call-to-action button linking to the booking or contact method.
3. THE Website SHALL export static SEO_Metadata for the `/services` route including a title, meta description, and Open Graph tags.
4. THE Website SHALL generate a JSON-LD `Service` schema for the services page to improve structured data indexing.
5. IF no Services exist in Firestore, THEN THE Website SHALL display a message indicating that services are coming soon.

---

### Requirement 5: Contact Form

**User Story:** As a Visitor, I want to send an inquiry to the psychic coach directly from the website, so that I can ask questions or request a consultation.

#### Acceptance Criteria

1. THE Website SHALL render a contact page at the `/contact` route containing a Contact_Form with fields for the Visitor's name, email address, subject, and message.
2. WHEN a Visitor submits the Contact_Form with all required fields populated and a valid email address format, THE Website SHALL write the submission as a document to a Firestore `contacts` collection and display a success confirmation message.
3. IF a Visitor submits the Contact_Form with any required field empty or with an invalid email address format, THEN THE Website SHALL display inline validation error messages without submitting the form to Firestore.
4. WHEN a Firestore write operation for a Contact_Form submission fails, THE Website SHALL display an error message instructing the Visitor to try again.
5. THE Website SHALL export static SEO_Metadata for the `/contact` route.

---

### Requirement 6: Admin Authentication

**User Story:** As the Admin, I want to securely log in to the website, so that I can manage blog posts and services without exposing the admin area to the public.

#### Acceptance Criteria

1. THE Website SHALL render an admin login page at `/admin/login` containing fields for email and password.
2. WHEN the Admin submits valid credentials, THE Firebase_Auth SHALL authenticate the Admin and THE Website SHALL redirect the Admin to the Admin_Dashboard at `/admin`.
3. IF the Admin submits invalid credentials, THEN THE Website SHALL display an authentication error message without redirecting.
4. WHILE the Admin is not authenticated, THE Website SHALL redirect any request to `/admin` or any sub-route of `/admin` to `/admin/login`.
5. WHEN the Admin clicks the logout button, THE Website SHALL sign the Admin out of Firebase_Auth and redirect to `/admin/login`.
6. THE Website SHALL protect all `/admin/*` routes using Next.js middleware that verifies the Firebase_Auth session before allowing access.

---

### Requirement 7: Admin Blog Post Management

**User Story:** As the Admin, I want to create, edit, and delete blog posts from the Admin_Dashboard, so that I can keep the blog content current and relevant.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a list of all Blog_Posts stored in Firestore, showing each post's title, published date, and published/draft status.
2. WHEN the Admin clicks "New Post", THE Admin_Dashboard SHALL render a blog post editor form containing fields for title, slug (auto-generated from title but editable), excerpt, cover image URL, tags, published status, and a Rich_Text_Editor for the body.
3. WHEN the Admin submits a valid new Blog_Post form, THE Website SHALL write the Blog_Post document to the Firestore `posts` collection and redirect the Admin to the post list.
4. WHEN the Admin clicks "Edit" on an existing Blog_Post, THE Admin_Dashboard SHALL pre-populate the editor form with the existing post's data.
5. WHEN the Admin submits a valid edited Blog_Post form, THE Website SHALL update the corresponding Firestore document and redirect the Admin to the post list.
6. WHEN the Admin clicks "Delete" on a Blog_Post and confirms the action, THE Website SHALL delete the corresponding Firestore document and remove the post from the list.
7. IF the Admin submits a Blog_Post form with the title field empty, THEN THE Admin_Dashboard SHALL display a validation error and SHALL NOT write to Firestore.
8. THE Slug SHALL be auto-generated from the title by converting the title to lowercase, replacing spaces with hyphens, and removing non-alphanumeric characters, but the Admin SHALL be able to override the auto-generated Slug manually.

---

### Requirement 8: Admin Service Management

**User Story:** As the Admin, I want to create, edit, and delete coaching services from the Admin_Dashboard, so that I can keep the services section accurate and up to date.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a list of all Services stored in Firestore, showing each service's name and active status.
2. WHEN the Admin clicks "New Service", THE Admin_Dashboard SHALL render a service form with fields for name, description, duration, price, booking link, and active status toggle.
3. WHEN the Admin submits a valid new Service form, THE Website SHALL write the Service document to the Firestore `services` collection and redirect the Admin to the service list.
4. WHEN the Admin clicks "Edit" on an existing Service, THE Admin_Dashboard SHALL pre-populate the service form with the existing service's data.
5. WHEN the Admin submits a valid edited Service form, THE Website SHALL update the corresponding Firestore document and redirect the Admin to the service list.
6. WHEN the Admin clicks "Delete" on a Service and confirms the action, THE Website SHALL delete the corresponding Firestore document and remove the service from the list.
7. IF the Admin submits a Service form with the name field empty, THEN THE Admin_Dashboard SHALL display a validation error and SHALL NOT write to Firestore.

---

### Requirement 9: SEO Optimization

**User Story:** As the Admin, I want every public page of the website to be fully optimized for search engines, so that Prateeksha's website ranks well in organic search results.

#### Acceptance Criteria

1. THE Website SHALL generate a dynamic `sitemap.xml` at `/sitemap.xml` listing all public routes including `/`, `/blog`, `/services`, `/contact`, and all individual `/blog/[slug]` URLs.
2. THE Website SHALL serve a `robots.txt` at `/robots.txt` that allows all crawlers to index all public routes and disallows crawling of `/admin/*`.
3. EVERY public page of the Website SHALL include a canonical URL `<link>` tag in the `<head>` element.
4. EVERY public page of the Website SHALL include Open Graph `og:title`, `og:description`, `og:image`, `og:url`, and `og:type` meta tags.
5. EVERY public page of the Website SHALL include Twitter Card `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` meta tags.
6. THE Website SHALL include a site-level JSON-LD `WebSite` schema in the root layout.
7. WHEN a Blog_Post page is rendered, THE Website SHALL include a JSON-LD `Article` schema with `headline`, `datePublished`, `dateModified`, `author`, `image`, and `description` fields populated from the Blog_Post data.

---

### Requirement 10: Design and User Experience

**User Story:** As a Visitor, I want the website to feel calm, elegant, and spiritually evocative, so that I feel comfortable and trust the psychic coach's brand.

#### Acceptance Criteria

1. THE Website SHALL apply a consistent design system using Tailwind CSS with a defined color palette, typography scale, and spacing scale that reflects a minimalist, mystical aesthetic.
2. THE Website SHALL use a serif or elegant sans-serif Google Font for headings and a clean sans-serif font for body text, loaded via Next.js font optimization.
3. THE Website SHALL render all pages with a persistent navigation header containing the site logo/name and links to `/blog`, `/services`, and `/contact`.
4. THE Website SHALL render all pages with a footer containing copyright information, social media links, and navigation links.
5. THE Website SHALL render all interactive elements (buttons, links, form inputs) with visible focus indicators to meet basic keyboard accessibility requirements.
6. THE Website SHALL render all images using the Next.js `<Image>` component with appropriate `alt` text, `width`, and `height` attributes.
7. WHEN a page is loading data from Firestore, THE Website SHALL display a skeleton loading state or spinner to indicate activity to the Visitor.
