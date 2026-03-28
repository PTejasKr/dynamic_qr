'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { useRouter, usePathname } from 'next/navigation';
import { Home, PlusSquare, LayoutDashboard, Sun, Moon } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Tooltip components optimized for minimalist 3D
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md bg-white px-3 py-1.5 text-xs font-bold text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] animate-in fade-in-0 zoom-in-95',
      'dark:bg-black dark:text-foreground dark:border-accent dark:shadow-[2px_2px_0px_rgba(255,140,0,0.5)]',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export function DockMorph({ className, position = 'bottom' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hovered, setHovered] = React.useState(null);
  
  const [theme, setTheme] = React.useState('light');
  
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const dockItems = [
    { icon: Home, label: 'Home', onClick: () => router.push('/'), active: pathname === '/' },
    { icon: PlusSquare, label: 'Create QR', onClick: () => router.push('/create'), active: pathname === '/create' },
    { icon: LayoutDashboard, label: 'Dashboard', onClick: () => router.push('/dashboard'), active: pathname === '/dashboard' },
    { icon: theme === 'dark' ? Sun : Moon, label: 'Toggle Theme', onClick: toggleTheme, active: false }
  ];

  const positionClasses = {
    bottom: 'fixed bottom-6 left-1/2 -translate-x-1/2',
    top: 'fixed top-6 left-1/2 -translate-x-1/2',
    left: 'fixed left-6 top-1/2 -translate-y-1/2 flex-col',
  };

  return (
    <div className={cn('z-50 flex items-center justify-center', positionClasses[position], className)}>
      <TooltipProvider delayDuration={100}>
        <div className={cn(
            'relative flex items-center gap-4 p-3 rounded-full',
            position === 'left' ? 'flex-col gap-4 px-4 py-8' : 'flex-row',
            'bg-white/80 dark:bg-black backdrop-blur-xl border-[3px] border-black dark:border-white shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.8)]'
          )}>
          {dockItems.map((item, i) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <div 
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <AnimatePresence>
                    {hovered === i && (
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className={cn(
                          'absolute inset-0 rounded-full -z-10',
                          'bg-primary/30 dark:bg-white/10',
                          'backdrop-blur-2xl'
                        )}
                      />
                    )}
                  </AnimatePresence>
                  
                  <button 
                    className={cn(
                      "relative z-10 p-3 rounded-full transition-all duration-200 outline-none cursor-pointer",
                      item.active 
                        ? "bg-primary text-black dark:bg-white dark:text-black border-[2px] border-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.8)]" 
                        : "hover:scale-110 text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                    )}
                    onClick={item.onClick}
                  >
                    <item.icon className="h-6 w-6" strokeWidth={item.active ? 2.5 : 2} />
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent side={position === 'left' ? 'right' : 'top'} className="mb-2">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
