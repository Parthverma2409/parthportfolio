# Parth Verma — 3D Portfolio Implementation Plan

## Current State Assessment

**Framework:** Next.js 16 (App Router) + React 19 + Tailwind CSS 3
**3D Stack:** Three.js + React-Three-Fiber + Drei (all installed)
**Build:** `next build` passes cleanly, all routes static-rendered

**What exists:**
- Next.js App Router with routes: `/`, `/about`, `/skills`, `/projects`, `/contact`
- Root layout (`src/app/layout.jsx`) with Navbar + Footer
- Three.js hero: StarField (2000 particles), GalaxyBrush (mouse-follow), Splash (click particles), floating sphere
- HeroContent glassmorphism card, FeaturedProjects grid, QuickLinks, Testimonials placeholder
- All Three.js components have `"use client"` directives
- `@/` path alias via `jsconfig.json`
- Empty component scaffolds for about, skills, projects, resume, blog sections
- Empty data files: projects.js, skills.js, timeline.js, blogs.js

**What needs to be built:**
Everything beyond the basic hero. This plan covers the full wireframe implementation.

---

## Design System

### Color Palette (Dark-First with Light Mode)

```
--bg-primary:        #0a0a0f (deep space black)
--bg-secondary:      #111118 (card backgrounds)
--bg-tertiary:       #1a1a24 (elevated surfaces)
--accent-primary:    #6366f1 (indigo-500 — primary CTA)
--accent-secondary:  #8b5cf6 (violet-500 — hover/glow)
--accent-tertiary:   #06b6d4 (cyan-500 — links/highlights)
--text-primary:      #f1f5f9 (slate-100)
--text-secondary:    #94a3b8 (slate-400)
--text-muted:        #64748b (slate-500)
--glass-bg:          rgba(255,255,255,0.05)
--glass-border:      rgba(255,255,255,0.1)
--glow-indigo:       0 0 40px rgba(99,102,241,0.3)
--glow-violet:       0 0 40px rgba(139,92,246,0.3)
```

### Typography
- **Headings:** Inter (700/800) or Space Grotesk (bold, techy feel)
- **Body:** Inter (400/500)
- **Mono/Code:** JetBrains Mono
- **Scale:** 14 / 16 / 18 / 24 / 32 / 48 / 64 / 80px

### Glassmorphism Tokens
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

---

## Phase 0 — Foundation & Tooling Setup

### 0.1 Install Dependencies
```bash
pnpm add gsap @gsap/react framer-motion lenis
pnpm add lucide-react clsx tailwind-merge class-variance-authority
```

### 0.2 Setup shadcn/ui
```bash
pnpm dlx shadcn@latest init
# Select: New York style, Slate, CSS variables: yes
# Then add components as needed:
pnpm dlx shadcn@latest add button card badge separator tabs tooltip dialog sheet
```

### 0.3 Configure Tailwind Theme
Extend `tailwind.config.cjs` with the design system colors, fonts, animations:
```js
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      accent: { DEFAULT: '#6366f1', hover: '#8b5cf6', cyan: '#06b6d4' },
      glass: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Space Grotesk', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    animation: {
      'float': 'float 6s ease-in-out infinite',
      'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      'slide-up': 'slide-up 0.6s ease-out',
    },
  },
}
```

### 0.4 Setup Smooth Scrolling (Lenis)
```jsx
// src/components/providers/SmoothScrollProvider.jsx ("use client")
// Wrap app in Lenis for buttery-smooth scroll
// Initialize with GSAP ScrollTrigger integration in layout.jsx
```

### 0.5 Setup GSAP + ScrollTrigger
```jsx
// src/lib/gsap.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
export { gsap, ScrollTrigger };
```

---

## Phase 1 — Global Components & Effects

### 1.1 Custom Cursor with Glow Trail
**File:** `src/components/ui/CustomCursor.jsx` (`"use client"`)
- Outer ring (32px) follows mouse with spring easing (GSAP)
- Inner dot (8px) follows instantly
- Glow effect: box-shadow with accent color
- Scale up on hover over interactive elements (buttons, links, cards)
- Blend mode: `mix-blend-mode: difference` for contrast
- Hide on mobile (check `useMediaQuery`)

### 1.2 Animated Navbar
**File:** `src/components/Navbar.jsx` (rewrite, `"use client"`)
- **Floating style:** `fixed top-4 left-4 right-4 z-50` with glassmorphism
- **Scroll behavior:** transparent at top → glass background on scroll (GSAP ScrollTrigger)
- **Logo:** "PV" monogram with hover glow animation
- **Links:** Next.js `<Link>` — Home, About, Skills, Projects, Contact — underline animation on hover
- **Mobile:** Sheet/drawer menu (shadcn Sheet) with staggered entrance
- **Active state:** Detect via `usePathname()` from `next/navigation`
- **Magnetic effect:** Links subtly pull toward cursor on hover (GSAP)

### 1.3 Dark/Light Theme Toggle
**File:** `src/components/ui/ThemeToggle.jsx` (`"use client"`)
- Morphing SVG: sun ↔ moon with smooth path morph (GSAP MorphSVG or CSS clip-path)
- Toggle in Navbar
- Use CSS variables + Tailwind `dark:` class strategy
- Store preference in localStorage
- Transition: all colors animate over 300ms

### 1.4 Page Transition Wrapper
**File:** `src/components/layout/PageTransition.jsx` (`"use client"`)
- Framer Motion `AnimatePresence` wrapping `{children}` in layout
- Slide-up + fade entry, fade-out exit
- Optional: curtain wipe effect using a full-screen div animated with GSAP

### 1.5 Scroll Progress Bar
**File:** `src/components/ui/ScrollProgress.jsx` (`"use client"`)
- Thin gradient line at very top of viewport
- Width maps to scroll percentage via GSAP ScrollTrigger
- Colors: indigo → violet → cyan gradient

### 1.6 Section Reveal Animation (Reusable)
**File:** `src/hooks/useScrollReveal.js`
- GSAP ScrollTrigger hook: fade-up + slight scale on enter
- Configurable: direction (up/left/right), delay, stagger for lists
- Apply to every section heading and content block

---

## Phase 2 — Home Page (Single-Page Scroll)

### 2.1 Hero Section (Rewrite)
**File:** `src/components/home/Hero.jsx`

**3D Canvas (Left/Background):**
- Keep StarField but enhance: add color variation (white + subtle blue/purple)
- Keep GalaxyBrush mouse-follow particles
- Replace floating sphere with **3D text "PARTH"** using `@react-three/drei` `Text3D` + custom font
  - Floating animation (Float component)
  - Metallic/iridescent material with environment map
  - Mouse-follow rotation (subtle tilt toward cursor)
- Add **post-processing**: bloom effect via `@react-three/postprocessing` for glow
- Scroll-triggered camera zoom-out (camera z moves from 3 → 5 as user scrolls)

**Content Overlay (Right):**
- Typewriter effect for tagline: "Frontend Developer | 3D Web | React"
  - Use GSAP `TextPlugin` or custom implementation
- Glass card with:
  - Name: "Hey, I'm Parth" (gradient text: indigo → violet)
  - Description paragraph
  - CTA buttons: "View Projects" (filled, magnetic hover) + "About Me" (outline, magnetic hover)
- Scroll-down indicator: animated chevron bouncing at bottom

**Interactions:**
- Mouse parallax: content layer shifts opposite to cursor movement
- Scroll: entire hero fades out + scales down as next section enters

### 2.2 About Section (Parallax Cards)
**File:** `src/components/home/AboutSection.jsx`

- Section header with scroll-reveal animation
- 3 parallax cards in a grid:
  - **Background card:** Profile photo / illustration
  - **Education card:** College, degree, year
  - **Experience card:** Key highlights
- Each card:
  - Glass background with gradient border on hover
  - `translateY` parallax on scroll (each card at different speed via GSAP)
  - Hover: card tilts in 3D (CSS `perspective` + `rotateX/Y` based on cursor position)
  - "Fun Fact" popup: on hover, a tooltip/popover appears with a fun fact (shadcn Tooltip)
- GSAP: cards stagger-animate into view from below

### 2.3 Skills/Features Section (Interactive Grid)
**File:** `src/components/home/SkillsSection.jsx`

- Section header: "What I Work With"
- **Interactive Tech Wheel** (desktop) / **Grid** (mobile):
  - Circular arrangement of tech icons (React, Three.js, Node.js, Python, TailwindCSS, etc.)
  - Each icon: glass card with SVG icon
  - **Hover effects:**
    - Card flips to show skill level/description (CSS 3D `rotateY(180deg)`)
    - Glow border matching tech brand color
    - Progress bar or circular progress fills on hover
  - **Scroll animation:** icons fly in from edges and settle into wheel/grid (GSAP stagger)
- Alternative: **Skill orbit** — icons orbit around a central "PV" logo in 3D space (Three.js)

### 2.4 Project List Section (Horizontal Carousel with 3D Frames)
**File:** `src/components/home/ProjectCarousel.jsx`

**Data — Your Real Projects:**
```js
const projects = [
  {
    id: 'gemini-cli',
    title: 'Gemini CLI',
    desc: 'AI-powered command-line tool using Google Gemini API',
    tags: ['AI', 'CLI', 'Node.js'],
    github: 'https://github.com/Parthverma2409/gemini-cli',
    category: 'AI/ML',
    color: '#6366f1',
  },
  {
    id: 'trustwall-saas',
    title: 'TrustWall SaaS',
    desc: 'Security-focused SaaS platform for trust verification',
    tags: ['SaaS', 'Security', 'Full-Stack'],
    github: 'https://github.com/Parthverma2409/trustwall-saas',
    category: 'Web',
    color: '#8b5cf6',
  },
  {
    id: 'civic-reporting',
    title: 'Civic Issue Reporter',
    desc: 'Crowdsourced platform for civic issue reporting and resolution',
    tags: ['React', 'Node.js', 'Maps'],
    github: 'https://github.com/Parthverma2409/Crowdsourced-Civic-lssue-Reporting-and-Resolution-System',
    category: 'Web',
    color: '#06b6d4',
  },
  {
    id: 'neuro-nest',
    title: 'Neuro Nest',
    desc: 'AI/ML platform for neural network experimentation',
    tags: ['AI', 'Python', 'ML'],
    github: 'https://github.com/Parthverma2409/Neuro-Nest',
    category: 'AI/ML',
    color: '#f59e0b',
  },
  {
    id: 'gaming-website',
    title: 'Gaming Website',
    desc: 'Immersive gaming community platform with 3D elements',
    tags: ['React', '3D', 'WebGL'],
    github: 'https://github.com/Parthverma2409/GamingWebsite',
    category: '3D/UI',
    color: '#ef4444',
  },
];
```

**Layout:**
- **Category filter tabs** at top: All / Web / AI-ML / 3D-UI / Data Analytics
  - Animated underline slides to active tab (GSAP)
  - Cards animate out/in on filter change (Framer Motion layout animation)
- **Horizontal scroll carousel** (GSAP ScrollTrigger horizontal pin):
  - Section pins while cards scroll horizontally
  - Each card:
    - **3D device frame mockup** (laptop/phone) using CSS clip-path or 3D CSS transforms
    - Screenshot/preview image inside the frame (use `next/image` for optimization)
    - Glass overlay with project title, description, tags
    - **Hover:** frame rotates slightly in 3D, glow intensifies, "View Project" button appears
    - Live demo link + GitHub link buttons
  - **Scroll progress:** thin line under carousel showing progress
- **Mobile:** vertical stack with swipe gestures

### 2.5 Timeline Section (Scroll-Pinned)
**File:** `src/components/home/TimelineSection.jsx`

- Vertical timeline with center line
- **GSAP ScrollTrigger pin:** section pins while timeline items reveal
- Animated SVG path draws as user scrolls (stroke-dashoffset animation)
- Each timeline node:
  - Circle icon on the center line (animated fill on reach)
  - Card to alternating left/right with glass style
  - Content: date, title, description, icon
  - Scroll-triggered: slide in from left/right + fade
- **3D progress bar** (optional): small floating 3D element that moves down the timeline with scroll
- Data: education milestones, project launches, achievements

### 2.6 Contact Form Section
**File:** `src/components/home/ContactSection.jsx`

- Split layout: form left, 3D mail icon right
- **Form fields** (shadcn Input, Textarea):
  - Animated labels that slide up on focus (GSAP)
  - Underline animation on focus (grows from center)
  - Validation with subtle shake animation on error
- **Magnetic "Send" button:**
  - Button follows cursor slightly when cursor is near (GSAP magnetic effect)
  - On hover: glow intensifies, text morphs or icon appears
  - On click: particle burst animation + success state
- **3D Mail Icon** (right side):
  - Three.js envelope model or geometric shape
  - Floats and rotates gently
  - Reacts to form interactions (opens when form is valid)
- Connect to Next.js API route (`src/app/api/contact/route.js`) or Formspree for actual sending

### 2.7 Testimonials Section
**File:** `src/components/home/TestimonialsSection.jsx`

- Auto-scrolling horizontal marquee of testimonial cards
- Each card: glass style, quote, author name, role, avatar
- GSAP-driven reveal: cards fade in with stagger
- Hover: card lifts (translateY) + shadow increases
- Pause marquee on hover

### 2.8 Early Access / Theme Section
**File:** `src/components/home/EarlyAccessSection.jsx`

- CTA section with gradient background
- Large heading: "Let's Build Something Together"
- Dark/light toggle showcase with morphing SVG animation
- Custom cursor glow easter egg: cursor trail leaves behind constellation pattern
- GSAP: zoom-in effect on scroll enter

---

## Phase 3 — Sub-Pages

### 3.1 About Me Page (`/about`)
**File:** `src/app/about/page.jsx`

Sections (from wireframe):
1. **Header:** "About Me" with animated underline
2. **About Section:** Parallax-scrolled cards (background, education, experience) with hover-triggered GSAP animations + "fun fact" popups
3. **Team Section:** (Optional) Collaborators/mentors with avatar cards
4. **Testimonial Section:** Quotes from colleagues/mentors
5. **Timeline Section:** Detailed vertical scroll-pinned career timeline with animated SVG path
6. **Benefits Section:** What I bring — animated icon cards (hover: icon animates, card glows)

### 3.2 Skills Page (`/skills`)
**File:** `src/app/skills/page.jsx`

Sections:
1. **Header:** "Technologies & Expertise"
2. **Skills Grid/Wheel:** Interactive tech wheel (desktop) or grid with flip/glow/progress animations
3. **Feature Section 1:** Deep-dive on a core skill (e.g., React ecosystem) — description, use cases, projects using it
4. **Feature Section 2:** Another skill deep-dive (e.g., 3D/WebGL)
5. **Feature Section 3:** Another skill deep-dive (e.g., Backend/Python)
6. **Team Section:** Contributors/collaborators for open-source work

### 3.3 Projects Page (`/projects`)
**File:** `src/app/projects/page.jsx`

Sections:
1. **Header:** "My Projects" with eye-catching animated text
2. **Category Filter:** Web / AI-ML / 3D-UI / Data Analytics — animated tab/button group
3. **Project List:** Carousel or grid with 3D device frame mockups
   - Each card: screenshot in device frame, title, tags, links
   - GSAP clip-path reveal on scroll
   - Hover: 3D tilt + glow
4. **Testimonials:** Project-specific feedback
5. **Contact CTA:** "Have a project in mind?" with animated form

### 3.4 Project Detail Page (`/projects/[slug]`)
**File:** `src/app/projects/[slug]/page.jsx`

- Hero with project screenshot in 3D frame
- Stats: stars, forks, language, last updated (fetch from GitHub API via `fetch` in server component)
- Story/description section
- Tech stack used (animated icons)
- Links: live demo, GitHub repo
- Related projects carousel
- Use `generateStaticParams()` for static generation of known project slugs

### 3.5 Contact Page (`/contact`)
**File:** `src/app/contact/page.jsx`

Sections:
1. **Header:** "Get In Touch"
2. **Contact Form:** Full animated form (same as home but larger)
3. **Contact Details:** Email, phone, physical address with subtle copy-to-clipboard animations
4. **Locations Section:** (Optional) Interactive map using Three.js globe or simple embedded map
5. **FAQ Section:** Collapsible accordion (shadcn Accordion) with GSAP open/close animations

---

## Phase 4 — Advanced Effects & Polish

### 4.1 Scroll Zoom-In Effect
- On specific sections, content starts at `scale(0.8) opacity(0)` and zooms to `scale(1) opacity(1)` as it enters viewport
- GSAP ScrollTrigger with `scrub: true` for smooth, scroll-linked zoom
- Apply to: hero 3D text, project cards, about cards, section headers

### 4.2 Mouse-Follow Parallax (Global)
**File:** `src/hooks/useMouseParallax.js`
- Track mouse position relative to viewport center
- Apply subtle `translateX/Y` to layered elements (background, midground, foreground)
- Depth factor configurable per element
- Uses `requestAnimationFrame` for performance

### 4.3 Magnetic Hover Effect (Reusable)
**File:** `src/components/ui/MagneticButton.jsx` (`"use client"`)
- Wrapper component that makes children "magnetic"
- On mousemove within a radius: element translates toward cursor
- On mouseleave: springs back to center (GSAP elastic ease)
- Apply to: all CTA buttons, navbar links, social icons

### 4.4 Card 3D Tilt on Hover
**File:** `src/hooks/useTiltEffect.js`
- Track cursor position over card
- Apply `rotateX` and `rotateY` based on cursor offset from center
- Add dynamic lighting: inner shadow shifts with tilt direction
- Subtle `scale(1.02)` on hover
- Uses CSS `perspective(1000px)` on parent

### 4.5 Text Reveal Animations
- **Split text:** Break headings into individual characters/words
- **Stagger reveal:** Characters animate in with GSAP SplitText-style effect
- **Gradient sweep:** Color gradient animates across text on scroll
- Apply to: all section headings, hero tagline

### 4.6 Particle Transitions Between Sections
- As user scrolls between sections, particles disperse and reform
- Or: sections connect with animated SVG lines/paths that draw on scroll

### 4.7 Preloader
**File:** `src/components/ui/Preloader.jsx` (`"use client"`)
- Full-screen overlay while assets load
- Animated "PV" logo with drawing SVG animation
- Progress percentage
- Exit: curtain wipe reveal (GSAP timeline)

---

## Phase 5 — Data & Content

### 5.1 Populate Data Files

**`src/data/projects.js`** — All 5 GitHub projects + placeholder for data analytics projects
**`src/data/skills.js`** — Tech stack with categories, proficiency levels, icons
**`src/data/timeline.js`** — Education, career milestones, project launches
**`src/data/testimonials.js`** — Testimonials/quotes

### 5.2 API Routes
**`src/app/api/contact/route.js`** — POST handler for contact form submissions
**`src/app/api/github/[repo]/route.js`** — Proxy to GitHub API for project stats (stars, forks)

---

## Phase 6 — Performance & Accessibility

### 6.1 Performance
- **Next.js automatic code splitting** per route (no manual `React.lazy` needed)
- **`next/image`** for all images: automatic WebP, lazy loading, srcset
- **`next/font`** for Inter, Space Grotesk — no layout shift from font loading
- **Dynamic imports** for heavy client components:
  ```jsx
  import dynamic from 'next/dynamic';
  const HeroCanvas = dynamic(() => import('@/components/home/HeroCanvas'), { ssr: false });
  ```
- **Three.js optimization:**
  - Reduce particle count on mobile (500 vs 2000)
  - Use `instancedMesh` for repeated geometries
  - Dispose geometries/materials on unmount
  - Lower pixel ratio on mobile: `dpr={[1, 1.5]}`
- **GSAP cleanup:** kill ScrollTriggers on component unmount
- **prefers-reduced-motion:** disable animations for accessibility

### 6.2 Accessibility
- All interactive elements: `cursor-pointer`, visible focus rings
- Semantic HTML: proper heading hierarchy, landmarks
- `aria-labels` on icon-only buttons
- Color contrast: minimum 4.5:1 for all text
- Skip-to-content link
- Keyboard navigation for carousel and filters

### 6.3 SEO (Next.js Native)
- `metadata` export in each `page.jsx` for title, description, OG tags
- `generateMetadata()` for dynamic project detail pages
- Structured data (JSON-LD) for person schema via `<script>` in layout
- `sitemap.xml` via `src/app/sitemap.js`
- `robots.txt` via `src/app/robots.js`

---

## File Structure (Target)

```
src/
├── app/
│   ├── layout.jsx                ← Root layout (Navbar, Footer, providers)
│   ├── page.jsx                  ← Home page
│   ├── globals.css               ← Tailwind + global styles
│   ├── about/
│   │   └── page.jsx
│   ├── skills/
│   │   └── page.jsx
│   ├── projects/
│   │   ├── page.jsx
│   │   └── [slug]/
│   │       └── page.jsx          ← Dynamic project detail
│   ├── contact/
│   │   └── page.jsx
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.js          ← Contact form handler
│   │   └── github/
│   │       └── [repo]/
│   │           └── route.js      ← GitHub stats proxy
│   ├── sitemap.js
│   └── robots.js
├── components/
│   ├── home/
│   │   ├── Hero.jsx              ← 3D hero with text + starfield
│   │   ├── HeroCanvas.jsx        ← Three.js canvas (enhanced)
│   │   ├── HeroContent.jsx       ← Glass card overlay
│   │   ├── StarField.jsx         ← Enhanced star particles
│   │   ├── GalaxyBrush.jsx       ← Mouse-follow particles
│   │   ├── Splash.jsx            ← Click particles
│   │   ├── AboutSection.jsx      ← Parallax cards
│   │   ├── SkillsSection.jsx     ← Interactive tech grid
│   │   ├── ProjectCarousel.jsx   ← Horizontal 3D carousel
│   │   ├── TimelineSection.jsx   ← Scroll-pinned timeline
│   │   ├── ContactSection.jsx    ← Animated form + 3D icon
│   │   ├── TestimonialsSection.jsx
│   │   └── EarlyAccessSection.jsx
│   ├── about/
│   ├── skills/
│   ├── projects/
│   ├── contact/
│   ├── providers/
│   │   ├── SmoothScrollProvider.jsx  ← Lenis smooth scroll
│   │   └── ThemeProvider.jsx         ← Dark/light mode context
│   ├── layout/
│   │   └── PageTransition.jsx
│   ├── ui/
│   │   ├── CustomCursor.jsx
│   │   ├── MagneticButton.jsx
│   │   ├── ScrollProgress.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── Preloader.jsx
│   │   ├── SectionHeader.jsx
│   │   └── (shadcn components...)
│   ├── Navbar.jsx
│   └── Footer.jsx
├── hooks/
│   ├── useScrollReveal.js
│   ├── useMouseParallax.js
│   ├── useTiltEffect.js
│   ├── useMediaQuery.js
│   └── useSmoothScroll.js
├── data/
│   ├── projects.js
│   ├── skills.js
│   ├── timeline.js
│   └── testimonials.js
├── lib/
│   ├── utils.js                  ← cn() helper for shadcn
│   └── gsap.js                   ← GSAP + plugin registration
└── styles/
    ├── animations.css
    └── variables.css
```

---

## Implementation Order (Recommended)

| Order | Task | Effort | Priority |
|-------|------|--------|----------|
| 1 | Phase 0: Install deps, GSAP, Lenis, shadcn | 1 day | Critical |
| 2 | Phase 1.2: Animated Navbar (glassmorphism, floating, `<Link>`) | 0.5 day | Critical |
| 3 | Phase 1.1: Custom Cursor | 0.5 day | High |
| 4 | Phase 2.1: Hero rewrite (3D text, typewriter, parallax) | 2 days | Critical |
| 5 | Phase 1.6: Section reveal hook (reusable) | 0.5 day | Critical |
| 6 | Phase 2.2: About section (parallax cards, tilt hover) | 1 day | High |
| 7 | Phase 2.3: Skills section (interactive grid, flip cards) | 1.5 days | High |
| 8 | Phase 2.4: Project carousel (3D frames, horizontal scroll) | 2 days | Critical |
| 9 | Phase 5.1: Populate all data files | 0.5 day | Critical |
| 10 | Phase 2.5: Timeline (scroll-pinned, SVG path draw) | 1.5 days | High |
| 11 | Phase 2.6: Contact form (magnetic button, 3D icon) | 1 day | High |
| 12 | Phase 2.7: Testimonials (marquee) | 0.5 day | Medium |
| 13 | Phase 1.3: Dark/light toggle | 0.5 day | Medium |
| 14 | Phase 4.1-4.5: Advanced effects (zoom, magnetic, tilt) | 1.5 days | High |
| 15 | Phase 3: Sub-pages (About, Skills, Projects, Contact) | 3 days | High |
| 16 | Phase 3.4: Project detail pages + GitHub API | 1 day | Medium |
| 17 | Phase 4.7: Preloader | 0.5 day | Medium |
| 18 | Phase 6: Performance, a11y, SEO polish | 1 day | High |
| 19 | Phase 1.4: Page transitions | 0.5 day | Medium |

**Total estimated scope: ~20 days of focused work**

---

## Key Libraries Summary

| Library | Purpose |
|---------|---------|
| `next` | Framework — SSR, routing, API routes, image/font optimization |
| `three` + `@react-three/fiber` + `@react-three/drei` | 3D rendering, text, effects |
| `@react-three/postprocessing` | Bloom, vignette, glow |
| `gsap` + `@gsap/react` | Scroll animations, magnetic effects, timeline |
| `gsap/ScrollTrigger` | Scroll-pinned sections, parallax |
| `framer-motion` | Page transitions, layout animations |
| `lenis` | Smooth scrolling |
| `shadcn/ui` | Button, Card, Badge, Tabs, Sheet, Accordion, Tooltip, Dialog |
| `lucide-react` | Icons |
| `tailwind-merge` + `clsx` + `cva` | Utility class management |

---

## Next.js-Specific Notes

- **Server vs Client components:** All Three.js, GSAP, and interactive components need `"use client"`. Data files and static content can stay as server components.
- **Dynamic imports with `ssr: false`:** Use for Three.js Canvas to avoid SSR hydration mismatches.
- **`next/image`:** Use for all project screenshots, avatars, and static images — automatic optimization.
- **`next/font`:** Load Inter and Space Grotesk via `next/font/google` in layout — zero layout shift.
- **API Routes:** Use `src/app/api/` for contact form and GitHub API proxy instead of external services.
- **Metadata API:** Export `metadata` objects from each page for SEO — no need for React Helmet.
- **Static generation:** All pages are statically generated by default. Use `generateStaticParams()` for project detail pages.

---

## General Notes

- **Mobile-first:** Every effect must gracefully degrade. Disable heavy 3D on low-end devices.
- **prefers-reduced-motion:** All GSAP/Framer animations check this media query.
- **Three.js budget:** Keep draw calls under 100, triangles under 50K for smooth 60fps.
- **GSAP ScrollTrigger cleanup:** Always `kill()` in useEffect cleanup to prevent memory leaks.
- **Data Analytics projects:** Placeholder category ready in filters — add projects as you build them.
