"use client";
import React from "react";
import { motion } from "framer-motion";

export function SpookySmoke() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background transition-colors duration-500">
      {/* Heavy blur filter layer */}
      <div className="absolute inset-0 backdrop-blur-[100px] z-10" />

      {/* Primary Neon Cyan Smoke Blob */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] rounded-full mix-blend-screen opacity-40 dark:opacity-60 blur-[60px]"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
        }}
        animate={{
          x: ["-20%", "20%", "-10%", "-20%"],
          y: ["-20%", "10%", "20%", "-20%"],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Secondary Neon Magenta Smoke Blob */}
      <motion.div
        className="absolute right-0 bottom-0 w-[50vw] h-[50vw] rounded-full mix-blend-screen opacity-30 dark:opacity-50 blur-[50px]"
        style={{
          background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)",
        }}
        animate={{
          x: ["10%", "-30%", "20%", "10%"],
          y: ["10%", "-20%", "-10%", "10%"],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />

      {/* Tertiary Neon Lime Smoke Blob */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-[40vw] h-[40vw] rounded-full mix-blend-screen opacity-20 dark:opacity-40 blur-[80px]"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        }}
        animate={{
          x: ["-50%", "0%", "-50%", "-50%"],
          y: ["-50%", "-30%", "-70%", "-50%"],
          scale: [1, 1.5, 0.9, 1],
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 5,
        }}
      />
      
      {/* Cyberpunk Grid Overlay (optional aesthetic layer) */}
      <div 
        className="absolute inset-0 z-20 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
    </div>
  );
}
