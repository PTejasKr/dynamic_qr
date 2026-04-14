'use client';

import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="w-full flex flex-col items-center min-h-screen pt-32 pb-24 px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-foreground">Get in <span className="text-secondary">Touch</span></h1>
          <p className="text-lg text-foreground/70 font-medium">Have questions or feedback? We'd love to hear from you.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-minimal space-y-6">
              <h2 className="text-2xl font-black text-foreground">Contact Info</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary border-[3px] border-black shadow-[3px_3px_0px_#000000]">
                    <Mail size={20} className="text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Email</p>
                    <p className="font-bold text-foreground">hello@qr.org</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-secondary border-[3px] border-black shadow-[3px_3px_0px_#000000]">
                    <Phone size={20} className="text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Phone</p>
                    <p className="font-bold text-foreground">+1 (555) 000-QRQR</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-accent border-[3px] border-black shadow-[3px_3px_0px_#000000]">
                    <MapPin size={20} className="text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Office</p>
                    <p className="font-bold text-foreground">3D Valley, Digital Space</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form className="card-minimal space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-black text-foreground uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-foreground uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-foreground uppercase tracking-wider">Message</label>
                <textarea 
                  placeholder="How can we help?"
                  rows={4}
                  className="input-field resize-none"
                ></textarea>
              </div>

              <button className="btn-3d w-full">
                Send Message <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
