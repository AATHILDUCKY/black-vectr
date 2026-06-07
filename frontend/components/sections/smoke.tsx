"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Galaxy } from "@/components/animation/galaxy";

/**
 * Animated WebGL galaxy hero backdrop based on the React Bits Galaxy component.
 */

export function SmokeBackground() {
  const reduce = useReducedMotion();

  const aurora = reduce
    ? {}
    : {
        animate: {
          x: [0, 34, -20, 0],
          y: [0, -28, 18, 0],
          scale: [1, 1.08, 0.98, 1],
          opacity: [0.48, 0.72, 0.55, 0.48],
        },
      };

  return (
    <div
      aria-hidden
      className="hero-atmosphere pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="galaxy-void" />
      <Galaxy
        className="galaxy-webgl"
        focal={[0.5, 0.34]}
        rotation={[0.92, -0.38]}
        starSpeed={0.62}
        density={1.55}
        hueShift={228}
        disableAnimation={!!reduce}
        speed={0.72}
        mouseInteraction={false}
        mouseRepulsion={false}
        glowIntensity={0.56}
        saturation={0.88}
        twinkleIntensity={0.42}
        rotationSpeed={0.035}
        autoCenterRepulsion={0.42}
        transparent
      />
      <div className="absolute inset-x-0 top-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="absolute inset-0 mix-blend-screen">
        <motion.div
          {...aurora}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[2%] top-[8%] h-[30rem] w-[46rem] -rotate-12 rounded-full bg-[radial-gradient(ellipse,hsl(var(--primary)/0.42),transparent_68%)] blur-3xl"
        />
        <motion.div
          {...aurora}
          transition={{ duration: 29, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute right-[-8%] top-[4%] h-[34rem] w-[50rem] rotate-12 rounded-full bg-[radial-gradient(ellipse,hsl(var(--accent)/0.34),transparent_70%)] blur-3xl"
        />
        <motion.div
          {...aurora}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute left-1/2 top-[24%] h-[26rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,hsl(186_92%_58%/0.22),transparent_72%)] blur-3xl"
        />
      </div>

      <div className="galaxy-nebula" />
      <div className={reduce ? "galaxy-comet" : "galaxy-comet animate-comet"} />
      <div className={reduce ? "hero-data-rain" : "hero-data-rain animate-data-rain"} />
    </div>
  );
}
