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

## ⚡ Supabase Cloud Database Integration

GreenCampus features first-class, production-ready **Supabase PostgreSQL** integration with zero-friction offline/demo fallback:

### 1. Features
- **Cloud Persistence**: Stores user footprint calculations (`footprint_records`), lab meter logs (`meter_readings`), and hardware drop-offs (`ewaste_donations`).
- **Row-Level Security (RLS)**: Enforces granular security policies while permitting public read access and authenticated/student inserts.
- **In-App Management**: Click the **"Supabase"** status badge in the navbar or open via `⌘K` to view real-time latency, test connection credentials, and sync local data to the cloud with 1 click.
- **Graceful Fallback**: If Supabase keys are not provided or if the network is disconnected, GreenCampus automatically defaults to typed local seed data without breaking any UI flow.

### 2. Quick Setup
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy and run the migration script from [`supabase/schema.sql`](./supabase/schema.sql) (or click *"Copy Schema SQL"* in the GreenCampus UI).
4. Add your project credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   *(Alternatively, configure directly in the browser via the Supabase modal without needing to restart the server!)*

---

## 🌐 Deploy to Vercel (Live in 60 seconds)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Futkarshmohit358%2Fgreen-campus&project-name=greencampus&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20PostgreSQL%20Cloud%20Credentials)

### Option A: Via Vercel Dashboard (Recommended)
1. Open [vercel.com/new](https://vercel.com/new).
2. Click **Import** next to your GitHub repo **`utkarshmohit358/green-campus`**.
3. Under **Environment Variables**, add:
   - **`NEXT_PUBLIC_SUPABASE_URL`**: `https://hmmrsmauexvmkuzpsvhh.supabase.co`
   - **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: `sb_publishable_6ihkYjTqafUJ1vNo1QfO9w_NibHER5-`
4. Click **Deploy**. Your app will be live with a production HTTPS URL in under a minute!

### Option B: Via Terminal CLI
```bash
npx vercel
# Follow the prompts and deploy directly to production:
npx vercel --prod
```

---

## 📜 Accessibility & Performance

- **Prefers-Reduced-Motion**: Automatically disables smooth scrolling and heavy scroll-scrub animations if user prefers reduced motion.
- **Dark Mode**: Fully supported with high-contrast glowing accents and persistent theme preference.
- **Global Search**: Press `⌘K` or `Ctrl+K` anytime to open the Command Palette.
