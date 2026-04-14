'use client';

import { motion } from 'framer-motion';
import { Info, Target, Users, Code } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full flex flex-col items-center min-h-screen pt-32 pb-24 px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-12"
      >
        <header className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-foreground drop-shadow-sm">
            About <span className="text-primary">qr.org</span>
          </h1>
          <p className="text-xl text-foreground/80 font-medium max-w-2xl mx-auto">
            We're redefining how people interact with the physical world through minimalist 3D design and dynamic redirection.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-minimal space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Target size={28} strokeWidth={3} />
              <h2 className="text-2xl font-black">Our Mission</h2>
            </div>
            <p className="font-medium text-foreground/70">
              To provide the simplest, most beautiful dynamic QR code infrastructure. No clutter, just pure functionality wrapped in a playful 3D aesthetic.
            </p>
          </div>

          <div className="card-minimal space-y-4">
            <div className="flex items-center gap-3 text-secondary">
              <Users size={28} strokeWidth={3} />
              <h2 className="text-2xl font-black">Community Driven</h2>
            </div>
            <p className="font-medium text-foreground/70">
              Built for creators, small businesses, and tech enthusiasts who value both form and function in their digital tools.
            </p>
          </div>
        </div>

        <section className="card-minimal space-y-8">
          <div className="flex items-center gap-3 text-accent">
            <Code size={28} strokeWidth={3} />
            <h2 className="text-2xl font-black">Technical Brilliance</h2>
          </div>
          <div className="space-y-4 font-medium text-foreground/80">
            <p>
              Our platform leverages Next.js, Framer Motion, and a custom minimalist 3D design system to deliver a smooth, high-performance experience.
            </p>
            <p>
              Under the hood, we use a robust redirection engine that ensures your QR codes never "expire" – you can update their destination anytime without changing the code itself.
            </p>
          </div>
          
          <div className="pt-4">
            <button className="btn-3d w-full md:w-auto">
              Learn More <Info size={18} />
            </button>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
