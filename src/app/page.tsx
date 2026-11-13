import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProblemStatement } from '@/components/sections/ProblemStatement';
import { PinnedFeatureStory } from '@/components/sections/PinnedFeatureStory';
import { ImpactCounters } from '@/components/sections/ImpactCounters';
import { SDGSection } from '@/components/sections/SDGSection';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { LeaderboardTeaser } from '@/components/sections/LeaderboardTeaser';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Hero with Masked Slide-up and Scroll-Scrubbed Visual */}
      <HeroSection />

      {/* 2. Problem Statement with Animated Metric Cards */}
      <ProblemStatement />

      {/* 3. Apple-Grade Sticky Pinned Feature Story (5-stage crossfade) */}
      <PinnedFeatureStory />

      {/* 4. Our Impact So Far (Animated Counters) */}
      <ImpactCounters />

      {/* 5. UN SDG 12 & SDG 13 Alignment Deep-Dive */}
      <SDGSection />

      {/* 6. 3-Step "How It Works" Timeline */}
      <HowItWorks />

      {/* 7. Leaderboard Teaser & Top 3 Podium */}
      <LeaderboardTeaser />

      {/* 8. Final High-Impact CTA */}
      <FinalCTA />
    </div>
  );
}
