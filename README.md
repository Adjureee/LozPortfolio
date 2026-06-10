# Premium Portfolio CMS

A Next.js portfolio with a Supabase-backed CMS, Cloudinary media upload, hidden admin access, Lenis smooth scrolling, GSAP ScrollTrigger, Framer Motion, and physics-driven interaction details.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Create the Supabase tables using `supabase/schema.sql`.
3. Add one admin row in `admin_profiles` for the Supabase Auth user that should access `/dashboard`.
4. Add Cloudinary credentials.
5. Install and run:

```bash
npm install
npm run dev
```

## Hidden Admin Access

On the homepage press `L O Z` quickly, or click the invisible 44px hotspot in the bottom-right corner five times. Both routes open `/admin-login`.

## Deployment

The project is ready for Vercel. Add the same environment variables in Vercel Project Settings before deploying.
