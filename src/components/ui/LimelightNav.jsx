"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function LimelightNav({ currentPath }) {
  const tabs = [
    { id: "/", label: "Home" },
    { id: "/create", label: "Create" },
    { id: "/dashboard", label: "Dashboard" }
  ];

  const [activeTab, setActiveTab] = useState(currentPath || "/");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-wrap justify-center items-center gap-4 w-full px-4 sm:w-auto">
      {/* Brand */}
      <div className="font-extrabold text-3xl tracking-tight text-foreground" style={{ textShadow: '3px 3px 0 var(--primary)'}}>
        qr.org
      </div>

      {/* Nav pill */}
      <nav className="flex items-center gap-1 bg-surface p-1.5 rounded-full border-[3px] border-foreground shadow-[4px_4px_0_var(--foreground)]">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 text-sm font-bold rounded-full transition-colors ${
              activeTab === tab.id
                ? "text-foreground"
                : "text-foreground/60 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-surface/80"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary border-[2px] border-foreground rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </a>
        ))}
      </nav>

      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="p-3 bg-surface rounded-full border-[3px] border-foreground text-foreground hover:bg-secondary transition-transform hover:-translate-y-1 shadow-[4px_4px_0_var(--foreground)] active:translate-y-0 active:shadow-none focus:outline-none"
        aria-label="Toggle Dark Mode"
      >
        {theme === "dark" ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
      </button>
    </div>
  );
}
