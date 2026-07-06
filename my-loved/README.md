# 💝 Our Story & My Loved

A premium, emotionally engaging digital scrapbooking and relationship timeline application built using **Next.js 16 (Turbopack)**, **React 19**, and **Framer Motion 12**. Designed to celebrate love milestones, capture sweet memories, and surprise your partner with an interactive anniversary letter vault.

---

## 🌟 Core Features

### 1. 💌 Interactive Surprise Envelope & Polaroid Reveal
A luxury digital greeting experience styled with a modern bubblegum, hot cherry pink, and glowing rose-gold aesthetic:
- **Wax Seal Ceremony**: Click the pulsing rose-gold wax seal (`📎❤️`) to trigger a seal-breaking animation, opening the envelope flaps.
- **Physical Photo Ejection**: Multiple large Polaroid cards smoothly emerge from behind the parchment letter, overshooting their fanned resting spots, and dropping subtly with inertia and gravity (tuned using spring damping coefficients).
- **Centered Spotlight Focus**: Hovering any photograph centers it on the screen, fading and blurring all other background elements (`opacity: 0.1`, `blur-[4px]`) to give absolute visual focus to that memory.
- **Handwritten Side-Car Note**: On hover, a warm lined-paper notebook page (`#fffdf5`) slides out to the right of the photo, displaying anniversary dates, timeline day count, locations, and personal notes in a cursive font.
- **Flicker-Free sticky Hover**: Incorporates a locking hover focus alongside a `40px` invisible boundary boundary extension overlay (`inset-[-40px]`) and a `350ms` exit delay to prevent jittering or accidental focus loss.

### 2. 🗓️ Milestone Timeline & Desktop Centering Wrapper
- **Centering Physics**: The Add Milestone card stays locked at the viewport vertical center during scrolling, utilizing trailing spring translation animations to reduce friction.
- **Responsive Routing**: Built pathname-synchronized navigation listeners to tie tab switching state to Next.js routes seamlessly.

### 3. 🔐 Timezone-Independent Anniversary Counters
- Formatted local hyphens split date parsing across dashboard cards, counters, and milestone list records. This resolves timezone offset shifting (off-by-one-day bug) for users living behind UTC midnights (e.g. PST/EST).

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Animation Engine**: [Framer Motion / Motion 12](https://motion.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Auth Provider**: [Clerk Authentication](https://clerk.com/)

---

## 🚀 Getting Started

### 1. Installation

Install project dependencies using `pnpm`:

```bash
pnpm install
```

### 2. Run the Development Server

Start the Turbopack dev server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience the application.

### 3. Build & Typecheck

Validate compilation, TypeScript rules, and linting configurations:

```bash
pnpm run build
```

---

## 📂 File Architecture (Key Sections)

- `components/loved/surprise/Envelope3D.tsx` — The wax-sealed opening envelope mechanism.
- `components/loved/surprise/PolaroidCard.tsx` — Polaroid spring movement, mouse parallax, and side-car slideouts.
- `components/loved/surprise/SurpriseTakeover.tsx` — Spotlight focus controller, backdrop blurs, and photo configurations.
- `components/LoveCounter.tsx` — Pathname tab synchronization and main wrapper.

---

## 🎨 Motion Design Philosophy
Built to deliver **Apple-quality digital interaction**. Transitions avoid standard linear durations in favor of physical mass, stiffness, and friction, replicating the organic feel of physical photographs casually spread across a wooden desk.
