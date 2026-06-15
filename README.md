# LozPortfolio

An interactive developer portfolio built on Next.js 15, featuring a navigable Windows 95 environment rendered inside a Three.js 3D scene. The desktop OS runs as a pre-compiled React application served via an iframe, overlaid onto a WebGL canvas using `@react-three/drei`'s `<Html>` portal.

**Live:** [adjureee.github.io/LozPortfolio](https://adjureee.github.io/LozPortfolio)

---

## Interactions

> Replace these placeholders with your recorded GIFs.

**Matter.js Physics — Draggable ID Badge**
![Physics Badge Interaction](/public/demos/badge-physics.gif)

**Three.js — Camera Fly-to on Hover**
![Camera Hover Zoom](/public/demos/camera-hover.gif)

**Boot & Shutdown Sequences**
![OS Boot and Shutdown](/public/demos/boot-shutdown.gif)

---

## System Architecture

The application is structured as three distinct rendering layers operating in parallel. The base layer is a `@react-three/fiber` canvas that renders the 3D Commodore 64 scene and drives a camera state machine (`ZOOMED_OUT → AT_SCREEN → BOOTING`) via `camera-controls`. Mounted inside that canvas via a Drei `<Html>` portal is an `<iframe>` that serves the Windows 95 OS — a separately compiled Create React App bundle located at `public/monitor-os/`. Cross-boundary communication between the iframe and the Next.js parent is handled entirely through `window.postMessage`, which triggers events such as shutdown dialogs, OS mute toggles, and tactile SFX. On top of both sits the standard Next.js React tree, which handles scroll-driven animations (GSAP + Lenis), the physics badge (Matter.js), and the Supabase-backed CMS dashboard.

```
Next.js App (React tree)
├── Lenis smooth scroll
├── GSAP ScrollTrigger animations
├── Matter.js physics canvas (ID badge)
├── SoundProvider context (3-tier audio)
│   ├── Tier 1 — Tactile SFX (mechanical clicks, always on)
│   ├── Tier 2 — OS Media (boot/shutdown video audio)
│   └── Tier 3 — Global BGM (background music)
└── Three.js Canvas (@react-three/fiber)
    ├── CameraControls — state machine (ZOOMED_OUT / AT_SCREEN / BOOTING)
    ├── Commodore64 — GLTF model + HTML video overlays (startup.mp4 / shutdown.mp4)
    └── <Html> portal — iframe → public/monitor-os/
        ├── My Showcase
        ├── Lozordle (custom Wordle clone)
        ├── Internet Explorer (iframe browser)
        └── DOS emulation — DOOM, Scrabble, Oregon Trail (js-dos)
```

---

## Stack

**Core**
- Next.js 15 (App Router)
- React 19
- TypeScript

**3D / Animation**
- Three.js, React Three Fiber, React Three Drei
- camera-controls
- Framer Motion
- GSAP + ScrollTrigger
- Lenis
- Matter.js

**Backend / CMS**
- Supabase (Postgres, Auth, Row Level Security)
- Cloudinary (media uploads)

**UI**
- Tailwind CSS
- Embla Carousel
- Lucide React

---

## Local Development

```bash
git clone https://github.com/Adjureee/LozPortfolio.git
cd LozPortfolio
npm install
cp .env.example .env.local   # fill in credentials
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Database

Execute the SQL files in `supabase/` against your Supabase project. Then insert one row into `admin_profiles` for the Auth user that should have dashboard access.

---

## Deployment

The project targets Vercel. Set the same environment variables under **Project Settings → Environment Variables** before deploying.

---

## Windows 95 OS — Modification Notes

The OS bundle at `public/monitor-os/static/js/main.fe030160.js` is a minified webpack build that has been patched directly (no source available). All custom apps (Lozordle, Internet Explorer) and their icons are injected by:

1. Adding a new module entry to the webpack module map with a base64-encoded PNG.
2. Registering the module ID in the webpack require context path map (`"./appIcon.png": MODULE_ID`).
3. Adding the icon key to the `Ge` icon registry object.
4. Appending an app entry to the `gu` application registry, which the desktop renderer iterates to build shortcuts.

Cross-window communication from the OS to the parent Next.js app uses `window.parent.postMessage(...)`. The parent listens for `TOGGLE_OS_MUTE`, `TRIGGER_SHUTDOWN_DIALOG`, `CLOSE_OS`, `mousedown`, and `mouseup` events.

---

<details>
<summary>Admin Access</summary>

The admin dashboard at `/dashboard` is not linked anywhere in the UI.

**Option A — Keyboard:** Press `L`, `O`, `Z` in sequence on the homepage.

**Option B — Click:** Click the invisible 44×44px element anchored to the bottom-right corner of the page exactly 5 times.

Both routes redirect to `/admin-login`, which uses Supabase Auth. The session is validated server-side via the `@supabase/ssr` cookie adapter.

</details>

---

**John Lyold Lozada** — [github.com/Adjureee](https://github.com/Adjureee)
