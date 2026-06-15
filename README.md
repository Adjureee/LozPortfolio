<div align="center">

# 🖥️ John Lyold Lozada — Interactive Portfolio OS

### *A premium developer portfolio disguised as a Windows 95 computer*

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

> **Boot a real Windows 95 OS. Browse a portfolio inside it. Play Lozordle. Open Internet Explorer.**  
> *All inside a 3D Commodore 64 CRT monitor rendered in WebGL.*

<br/>

---

</div>

## ✨ What Makes This Different

This isn't a portfolio with a Windows 95 *theme* — it's a fully operational Win95 environment embedded inside an interactive 3D scene. Visitors literally power on the computer, watch a boot sequence video, and then use a mouse to interact with a real desktop OS — complete with a Start menu, taskbar, working apps, and a system clock.

```
🖥️  3D Commodore 64 scene (WebGL / Three.js)
 └── 📺  CRT monitor (real startup & shutdown .mp4 sequences)
      └── 🪟  Windows 95 OS (fully interactive iframe)
           ├── 📁  My Showcase  — live project gallery
           ├── 🎮  Lozordle     — custom Wordle clone ("LYOLD" twist)
           ├── 🌐  Internet Explorer — iframe browsing
           ├── 🕹️  DOOM / Scrabble / Oregon Trail (DOS emulated)
           └── 🔊  Three-tier audio architecture
```

---

## 🎬 Experience Layers

| Layer | What Happens |
|-------|-------------|
| **Landing** | Physics-driven ID badge you can drag & yank |
| **Boot** | Click to power on → real startup video plays |
| **OS Mode** | Hover monitor to zoom in → full Win95 desktop loads |
| **Shutdown** | Click Start → Shut Down → shutdown video sequence |
| **Portfolio** | Scroll past the OS for projects, skills, experience |

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- ⚡ Next.js 15 (App Router)
- ⚛️ React 19
- 🎨 Framer Motion — page & component animations
- 🖱️ Lenis — buttery smooth scrolling
- 💥 GSAP + ScrollTrigger — scroll-driven animations
- 📦 Embla Carousel — glide-scroll project cards

</td>
<td valign="top" width="50%">

**3D & Physics**
- 🌐 Three.js + React Three Fiber
- 📷 Camera Controls (Drei) — smooth camera fly-to
- ⚙️ Matter.js — physics-based ID badge interaction
- 🎭 React Three Drei — HTML overlays in 3D space

</td>
</tr>
<tr>
<td valign="top">

**Backend & CMS**
- 🗄️ Supabase — projects, experiences, achievements
- ☁️ Cloudinary — media uploads
- 🔐 Hidden admin dashboard (`/dashboard`)
- 🔒 Supabase Auth — server-side session management

</td>
<td valign="top">

**Audio Architecture (3 Tiers)**
- 🖱️ **Tier 1 – Tactile SFX**: mechanical click sounds, always on
- 🖥️ **Tier 2 – OS Media**: boot/shutdown video audio, toggleable
- 🎵 **Tier 3 – Global BGM**: background music, user-controlled

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Cloudinary](https://cloudinary.com) account

### Installation

```bash
# Clone the repository
git clone https://github.com/Adjureee/LozPortfolio.git
cd LozPortfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# → Fill in your Supabase and Cloudinary credentials

# Run locally
npm run dev
```

### Database Setup

Run the SQL schema in your Supabase SQL editor:

```bash
# Tables needed:
# - projects
# - experiences
# - achievements
# - admin_profiles
# - messages
# - visitors
```

Add one row to `admin_profiles` for the Supabase Auth user that should access `/dashboard`.

---

## 🔐 Secret Admin Access

The admin panel is completely hidden from the UI. Two ways to access it:

| Method | Action |
|--------|--------|
| **Keyboard** | Press `L` → `O` → `Z` quickly on the homepage |
| **Click** | Click the invisible 44×44px hotspot in the **bottom-right corner** 5 times |

Both routes open `/admin-login` → Supabase Auth → `/dashboard`

---

## 🎮 Windows 95 Apps

The OS desktop contains working applications:

| App | Description |
|-----|-------------|
| **My Showcase** | Auto-opens on boot. Live portfolio with projects & info |
| **Lozordle** | Custom Wordle with a "LYOLD" twist. Find the daily word! |
| **Internet Explorer** | Iframe browser — loads the live portfolio site |
| **DOOM** | Fully playable classic DOOM via js-dos emulation |
| **Scrabble** | Classic board game, DOS emulated |
| **Oregon Trail** | The iconic educational game, DOS emulated |

---

## 🏗️ Project Structure

```
LozPortfolio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── dashboard/          # Hidden admin CMS
│   │   └── api/                # API routes (upload, etc.)
│   ├── components/
│   │   ├── public/
│   │   │   ├── crt-os-scene.tsx    # Camera state machine + hover-zoom toggle
│   │   │   ├── commodore-64.tsx    # 3D model + video boot sequences
│   │   │   ├── hero-section.tsx    # Main orchestrator (boot/shutdown logic)
│   │   │   └── ...
│   │   └── providers/
│   │       └── sound-provider.tsx  # 3-tier audio context
│   └── lib/                    # Supabase client, utilities
├── public/
│   ├── monitor-os/             # Compiled Windows 95 React app (iframe)
│   │   └── static/js/          # Patched webpack bundle (custom apps/icons)
│   └── video/                  # startup.mp4 & shutdown.mp4
└── supabase/                   # SQL schema files
```

---

## 🌍 Deployment

The project is Vercel-ready out of the box.

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in **Project Settings → Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🧩 Features Checklist

- [x] Interactive 3D scene with WebGL CRT monitor
- [x] Real startup & shutdown video sequences with audio
- [x] Full Windows 95 OS experience inside an iframe
- [x] Hover-to-zoom camera with toggle button
- [x] Three-tier audio architecture (Tactile / OS / Global)
- [x] Custom Lozordle game with personalized word bank
- [x] Internet Explorer app with portfolio iframe
- [x] Supabase-backed CMS with hidden admin dashboard
- [x] Physics-driven draggable ID badge
- [x] Smooth scroll (Lenis) + scroll animations (GSAP)
- [x] Cloudinary media upload pipeline
- [x] Responsive design

---

<div align="center">

**Built with ❤️ by [John Lyold Lozada](https://github.com/Adjureee)**

*"Every interaction should feel like it has weight."*

</div>
