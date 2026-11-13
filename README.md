# GreenCampus – Sustainable Computing for Colleges

> **An Apple-grade, high-performance platform where an entire college can monitor, model, and drastically slash its computing carbon footprint.**  
> Aligned with **UN SDG 12 (Responsible Consumption & Production)** and **SDG 13 (Climate Action)**.

---

## 🌟 Key Features

1. **Student Device Emission Calculator (`/calculator`)**
   - Multi-device ecosystem picker (laptops, phones, desktops, monitors, peripherals).
   - Computes operational emissions using India’s official grid factor (**0.71 kg CO₂/kWh**) + amortized embodied manufacturing emissions.
   - Greener Score (out of 100), real-world equivalents (trees needed, km driven, smartphone charges), 5+ personalized tips.
   - Saves footprint history in typed `localStorage` and generates exportable high-res PNG share cards.

2. **Department Lab Electricity Tracker (`/labs`)**
   - 8 academic departments (CSE, IT, ECE, EE, Mech, Civil, MBA, Bio) across 14 computer labs.
   - 12-month consumption trends, kWh/PC metrics, and 24x7 peak-hours power heatmap.
   - Overnight idle vampire load anomaly detection.
   - Interactive **What-If policy simulator**: drag to model savings in kWh, CO₂, and ₹ from shutting down idle PCs after 6:00 PM.
   - Form to log new sub-meter readings with instant validation.

3. **E-Waste Collection & Circular Monitor (`/ewaste`)**
   - Hardware tracking across 8 categories with unit counts and weights.
   - 98.4% landfill diversion rate through direct community reuse, refurbished lab PCs, and certified R2 hydrometallurgical recycling.
   - Quantified precious material recovery: **135g gold**, **578kg copper**, **410kg aluminium**.
   - Interactive campus map with 6 smart drop pins and live capacity fill-level indicators.
   - Collection drive calendar and public drop-off logging modal.

4. **Sustainability Leaderboard & Honors (`/leaderboard`)**
   - Transparent Green Score formula: Lab energy reduction (35%), student footprint (25%), e-waste per head (20%), participation rate (20%).
   - Animated top-3 podium, FLIP animated reordering, sortable columns, rank-change arrows, and achievement badges.
   - Student champion leaderboard with privacy-preserving anonymization toggle.

5. **Monthly Campus Sustainability Report (`/reports`)**
   - Auto-generated editorial ESG dossiers for NIRF and NAAC compliance.
   - Executive summaries, KPI strips, milestone timelines, directives, and verified SDG metrics.
   - Dedicated print stylesheet for clean browser PDF export and one-click share links.

6. **Unified Campus Command Center (`/dashboard`)**
   - Real-time institutional overview aggregating energy, e-waste, student pledges, and department standings.
   - Live campus activity stream.

7. **Methodology (`/about`) & UN SDG Deep-Dive (`/sdg`)**
   - Complete mathematical documentation of emission formulas, CEA baseline factors, and ISO 14040/44 life-cycle assessment standards.

---

## 🛠️ Tech Stack & Motion Architecture

- **Framework**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Motion & Interactivity**:
  - **Lenis**: Buttery 60fps smooth scrolling site-wide.
  - **GSAP + ScrollTrigger**: Scroll-scrubbed hero globe rotation, Apple-style pinned 5-stage storytelling showcase, and counter animations.
  - **Framer Motion**: FLIP table reordering, modals, drawer animations, and page transitions.
  - **Recharts**: Responsive area, bar, line, and donut charts.
  - **canvas-confetti**: Rewarding celebratory bursts upon pledge completion.
  - **html-to-image**: Client-side PNG image rendering for shareable cards.
- **Testing**: Vitest unit test suite covering all emission and scoring algorithms.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v25)
- npm 9+

### Installation & Run

```bash
# Clone or navigate to directory
cd "green campus"

# Install dependencies (already completed)
npm install

# Run Vitest unit tests
npm test

# Run Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Unit Tests

Run the pure calculation test suite:
```bash
npm test
```
All 13 pure calculation tests verify:
- Operational kWh calculations across eco, normal, and performance profiles.
- Indian national grid CO₂ factor calculations.
- Embodied emissions amortization and lifecycle extension rewards.
- What-if idle shutdown savings in kWh, CO₂, and ₹.
- Department Green Score weighting algorithm.
- E-waste precious mineral extraction rates.

---

## 📂 Project Folder Map

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, Providers, Navbar, Footer, CommandPalette)
│   ├── page.tsx                # Apple-style landing page (Hero, Pinned Story, SDG, Impact)
│   ├── globals.css             # Glassmorphism, CSS variables, dark mode tokens, print styles
│   ├── calculator/page.tsx     # Student Device Footprint Calculator & PNG share card
│   ├── labs/page.tsx           # Department Lab Tracker, 24x7 heatmap & What-If simulator
│   ├── ewaste/page.tsx         # Circular E-Waste Monitor, campus map & material extraction
│   ├── leaderboard/page.tsx    # Multi-factor rankings, animated podium & FLIP sorting
│   ├── reports/page.tsx        # Monthly ESG executive report generator & PDF print layout
│   ├── dashboard/page.tsx      # Unified campus command center & real-time telemetry
│   ├── about/page.tsx          # Scientific methodology, formulas & emission constants
│   ├── sdg/page.tsx            # UN SDG 12 & 13 alignment deep-dive
│   ├── not-found.tsx           # Custom 404 page
│   ├── loading.tsx             # Loading skeleton UI
│   ├── sitemap.ts              # Dynamic XML sitemap generator
│   ├── robots.ts               # Robots.txt rules
│   ├── opengraph-image.tsx     # Dynamic social OpenGraph banner
│   └── api/                    # Typed API routes for labs, ewaste, leaderboard, and reports
├── components/
│   ├── ui/                     # Navbar, Footer, CommandPalette (⌘K), RoleSwitcher, ThemeToggle, Toast
│   ├── sections/               # HeroSection, PinnedFeatureStory, ProblemStatement, ImpactCounters, etc.
│   └── providers/              # ThemeProvider (Dark/Light), RoleProvider (Student/Admin/CSO)
├── lib/
│   ├── constants.ts            # Official emission factors, grid intensity, catalog specs, weights
│   ├── calculations.ts         # Pure deterministic calculation functions
│   ├── calculations.test.ts    # Vitest unit test suite (13 passing tests)
│   ├── lenis.tsx               # Lenis smooth scroll provider synced with GSAP
│   ├── storage.ts              # Typed LocalStorage persistence layer
│   └── utils.ts                # Classname helper, number formatters, INR currency
└── data/
    ├── departments.json        # 8 departments, 14 computer labs, 12-month power history, heatmaps
    ├── ewaste.json             # Categories, 6 smart bins, recovery metrics, past/upcoming drives
    ├── leaderboard.json        # Department & student rankings with badges and sparklines
    └── reports.json            # Pre-computed monthly executive reports for accreditation
```

---

## ⚡ How Emission Factors & Calculations Work

### 1. Operational Power
$$\text{Annual kWh} = \frac{\text{Watts} \times \text{Multiplier} \times \text{Hours/Day} \times \text{Days/Week} \times 52}{1000}$$
$$\text{CO}_2 \text{ (kg)} = \text{Annual kWh} \times 0.710 \text{ kg CO}_2\text{/kWh}$$
*Source: Central Electricity Authority (CEA) of India CO₂ Baseline Database v19.0.*

### 2. Embodied Manufacturing Carbon
$$\text{Annual Embodied } \text{CO}_2 = \frac{\text{Total Manufacturing Footprint (kg)}}{\max(\text{Standard Lifespan}, \text{Actual Age})}$$
*Extending a laptop from 3 to 5 years cuts annualized manufacturing carbon burden by 40%.*

---

## 🔄 Swapping Mock Data for a Production Database

GreenCampus features a decoupled data access layer:
1. **API Endpoints**: All UI components read and mutate data via Next.js API routes (`/api/labs`, `/api/ewaste`, `/api/leaderboard`, `/api/reports`).
2. **Database Migration**: To switch from JSON/localStorage to PostgreSQL (e.g. Supabase, Prisma, Neon):
   - Replace file reads in `src/app/api/*/route.ts` with your ORM queries (`prisma.lab.findMany()`).
   - The UI components and calculations require zero modification as they consume typed JSON contracts.

---

## 📜 Accessibility & Performance

- **Prefers-Reduced-Motion**: Automatically disables smooth scrolling and heavy scroll-scrub animations if user prefers reduced motion.
- **Dark Mode**: Fully supported with high-contrast glowing accents and persistent theme preference.
- **Global Search**: Press `⌘K` or `Ctrl+K` anytime to open the Command Palette.
