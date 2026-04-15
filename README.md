# 🧭 Soul Compass — Spiritual & Psychic Coaching

A premium, modern web application for a spiritual coach, built with **Next.js 15**, **Firebase**, and **Tailwind CSS**. This platform provides a serene, mystical user experience designed to showcase services, share wisdom through a blog, and facilitate client bookings.

![Soul Compass Banner](/images/hero-bg.png)

## ✨ Key Features

-   **Dynamic Hero Section**: Interactive, atmospheric hero section with custom-generated mystical imagery.
-   **Service Showcases**: Elegant cards for Tarot readings, Crystal healing, and Astrology sessions.
-   **Integrated Blog**: A fully functional blog system powered by Firestore.
-   **Admin Dashboard Ready**: Structured to support server-side Firestore management via the Firebase Admin SDK.
-   **Responsive Design**: A premium, "mobile-first" experience that looks stunning on any device.
-   **SEO Optimized**: Automated meta tags, OpenGraph support, and JSON-LD schema for better search visibility.

## 🛠 Tech Stack

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
-   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
-   **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) (Ready for implementation)
-   **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage) for media
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Modern Vanilla CSS
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

### 1. Prerequisites
-   Node.js 18.x or later
-   A Firebase Project

### 2. Environment Setup
Create a `.env.local` file in the root directory and populate it with your Firebase credentials (refer to `.env.local.example`):

```bash
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... etc

# Firebase Admin SDK (Server Only)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...
```

### 3. Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎨 Asset Information

This project features custom-generated AI assets located in `/public/images/`:
-   `logo.png`: Minimalist golden geometric line art.
-   `hero-bg.png`: Mystical golden compass background.
-   `coach-portrait.png`: Professional cinematic portrait of a spiritual coach.
-   `service-tarot.png`, `service-healing.png`, `service-astrology.png`: Thematic service imagery.

---

*Crafted with ✨ by Antigravity*
