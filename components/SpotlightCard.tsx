
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({ 
  children, 
  className = "",
  spotlightColor = "rgba(20, 184, 166, 0.15)" // brand-500 equivalent
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for spotlight
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Transform motion values into degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Calculate spotlight position relative to card
    setPosition({ 
      x: clientX - rect.left, 
      y: clientY - rect.top 
    });

    // Calculate normalized position for tilt (-0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;
    
    const xPct = (clientX - rect.left) / width - 0.5;
    const yPct = (clientY - rect.top) / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative z-10 rounded-2xl transition-all duration-200 ${className}`}
    >
      {/* 3D Depth layers */}
      <div 
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }} 
        className="relative h-full"
      >
        {/* Spotlight Overlay */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-30"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
          }}
        />
        
        {/* Main Content Container */}
        <div className="relative h-full bg-white/80 dark:bg-[#0b1121]/90 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-none">
             {/* Subtle internal grid/noise texture could go here */}
             <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-white/[0.02] bg-[length:20px_20px]" />
             {children}
        </div>
      </div>
      
      {/* Glossy Reflection (simulated) */}
      <div 
        className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/5 dark:ring-white/10 group-hover:ring-slate-900/10 dark:group-hover:ring-white/20 transition-all z-20 pointer-events-none" 
      />
      
      {/* Shadow/Glow behind card */}
      <div 
        className={`absolute -inset-4 bg-brand-500/20 blur-2xl rounded-[30px] -z-10 transition-opacity duration-500 ${isHovered ? 'opacity-50' : 'opacity-0'}`}
        style={{ transform: "translateZ(-50px)" }}
      />
    </motion.div>
  );
};
