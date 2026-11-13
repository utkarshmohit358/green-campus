'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textMaskRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initial Masked Line-by-Line Entrance Animation
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // Line-by-line slide up from masked overflow
        gsap.from('.hero-line-inner', {
          y: '100%',
          opacity: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
        });

        gsap.from(visualRef.current, {
          scale: 0.85,
          opacity: 0,
          rotation: -15,
          duration: 1.4,
          ease: 'power2.out',
          delay: 0.3,
        });

        gsap.from(ctaRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          delay: 0.7,
          ease: 'power2.out',
        });

        // 2. Scroll-scrubbed hero scale down and globe rotation
        if (containerRef.current && visualRef.current) {
          gsap.to(containerRef.current, {
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
            scale: 0.93,
            opacity: 0.45,
            ease: 'none',
          });

          gsap.to(visualRef.current, {
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
            rotation: 180,
            scale: 0.7,
            ease: 'none',
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      {/* Background Soft Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] radial-glow pointer-events-none rounded-full blur-3xl opacity-70" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] radial-glow-amber pointer-events-none rounded-full blur-3xl opacity-40" />

      {/* Pill Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Institutional Decarbonization for Modern Academia</span>
      </div>

      {/* Hero Headline with Masked Reveals */}
      <div ref={textMaskRef} className="text-center max-w-5xl mx-auto space-y-1 sm:space-y-2">
        <div className="overflow-hidden">
          <h1 className="hero-line-inner hero-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-neutral-900 dark:text-white">
            Computing with
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line-inner hero-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
            a Zero-Carbon Heart.
          </h1>
        </div>
        <div className="overflow-hidden pt-4">
          <p className="hero-line-inner text-base sm:text-xl md:text-2xl font-normal text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Monitor, measure, and drastically shrink your university&apos;s digital electricity, lab energy, and electronic waste. Supporting <strong className="text-neutral-900 dark:text-white font-semibold">UN SDG 12 &amp; SDG 13</strong> with transparent engineering.
          </p>
        </div>
      </div>

      {/* Animated Earth / Leaf SVG Motif */}
      <div
        ref={visualRef}
        className="my-10 relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center"
      >
        {/* Outer orbital rings */}
        <div className="absolute inset-0 rounded-full border border-emerald-500/25 dark:border-emerald-400/20 animate-spin" style={{ animationDuration: '35s' }} />
        <div className="absolute inset-4 rounded-full border border-dashed border-emerald-400/30 dark:border-emerald-300/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />

        {/* Central Globe & Leaf Motif */}
        <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-[#0B3D2E] via-emerald-800 to-emerald-600 p-0.5 shadow-2xl shadow-emerald-900/30 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#061A13]/90 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
            {/* Abstract Circuit Grid Lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-35"
              viewBox="0 0 100 100"
              fill="none"
              stroke="#34D399"
              strokeWidth="0.75"
            >
              <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="26" />
              <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="2 2" />
              <line x1="10" y1="50" x2="90" y2="50" strokeDasharray="2 2" />
              <path d="M 25 35 Q 50 15 75 35" />
              <path d="M 25 65 Q 50 85 75 65" />
            </svg>

            {/* Radiant Leaf Icon in Center */}
            <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                fill="currentColor"
              >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div
        ref={ctaRef}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto"
      >
        <Link
          href="/calculator"
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <span>Calculate My Footprint</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-neutral-300 dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 font-semibold text-sm text-neutral-800 dark:text-neutral-200 transition-all flex items-center justify-center"
        >
          View Campus Command Center
        </Link>
      </div>

      {/* Down arrow indicator */}
      <div className="mt-12 text-neutral-400 dark:text-neutral-500 animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}
