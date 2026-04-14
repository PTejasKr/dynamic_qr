'use client';

import { motion } from 'framer-motion';
import { History, Sparkles, Rocket, Heart } from 'lucide-react';

const milestones = [
  {
    year: '2024',
    title: 'The Spark',
    content: 'It started with a simple question: Why do QR codes have to be so ugly? We began experimenting with 3D design software and redirection logic.',
    icon: Sparkles,
    color: 'bg-primary'
  },
  {
    year: '2025',
    title: 'Minimalist Edition 1.0',
    content: 'We launched our first version to a small group of beta testers. The feedback was clear: people loved the "soft" 3D aesthetic.',
    icon: Rocket,
    color: 'bg-secondary'
  },
  {
    year: '2026',
    title: 'Dynamic Revolution',
    content: 'Today, qr.org powers thousands of dynamic connections worldwide, maintaining its commitment to minimalist excellence.',
    icon: Heart,
    color: 'bg-accent'
  }
];

export default function Story() {
  return (
    <div className="w-full flex flex-col items-center min-h-screen pt-32 pb-24 px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <header className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-[3px] border-black bg-white font-black text-xs uppercase tracking-tighter shadow-[4px_4px_0px_#000000]">
            <History size={14} /> Our Journey
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground antialiased italic">
            Behind the <span className="text-primary underline decoration-black decoration-[12px] underline-offset-[-2px] not-italic">Design</span>
          </h1>
          <p className="text-xl text-foreground/70 font-medium max-w-2xl mx-auto">
            From a garage prototype to a global design system, this is the story of qr.org.
          </p>
        </header>

        <div className="relative space-y-12">
          {/* Timeline Line */}
          <div className="absolute left-[23px] top-4 bottom-4 w-[6px] bg-black dark:bg-white hidden md:block"></div>

          {milestones.map((ms, idx) => (
            <motion.div 
              key={ms.year}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="relative pl-0 md:pl-20"
            >
              {/* Timeline dot */}
              <div className={`absolute left-0 top-[22px] w-[52px] h-[52px] rounded-full ${ms.color} border-[4px] border-black z-20 hidden md:flex items-center justify-center shadow-[4px_4px_0px_#000000]`}>
                <ms.icon size={24} className="text-black" />
              </div>

              <div className="card-minimal space-y-4">
                <span className="text-4xl font-black text-foreground/20 italic">{ms.year}</span>
                <h2 className="text-3xl font-black text-foreground">{ms.title}</h2>
                <p className="text-lg font-medium text-foreground/70 leading-relaxed">
                  {ms.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-24 card-minimal bg-black text-white text-center space-y-8">
          <h2 className="text-4xl font-black">Join the Story</h2>
          <p className="text-lg font-medium text-neutral-400 max-w-xl mx-auto">
            We're just getting started. Every QR code created is a new chapter in our mission to beautify the digital world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="btn-3d bg-primary border-white shadow-[6px_6px_0px_#ffffff] text-black">
              Start Your Journey
            </button>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
