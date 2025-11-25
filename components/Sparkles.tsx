import React, { useEffect, useRef, useId } from "react";

interface SparklesProps {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
  speed?: number;
}

export const SparklesCore: React.FC<SparklesProps> = ({
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  className = "h-full w-full",
  particleColor = "#FFFFFF",
  speed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const id = useId();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      opacitySpeed: number;
    }> = [];

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Handle high DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Calculate particle count based on density and area
      const area = width * height;
      const particleCount = Math.floor((area / 10000) * particleDensity);

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() * 0.5 - 0.25) * speed,
          speedY: (Math.random() * 0.5 - 0.25) * speed,
          opacity: Math.random(),
          opacitySpeed: (Math.random() * 0.02 - 0.01) * speed
        });
      }
    };

    const draw = () => {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacitySpeed;

        // Bounce opacity
        if (p.opacity <= 0) {
          p.opacity = 0;
          p.opacitySpeed *= -1;
        } else if (p.opacity >= 1) {
          p.opacity = 1;
          p.opacitySpeed *= -1;
        }

        // Wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    // Handle resize with debounce/observer
    const resizeObserver = new ResizeObserver(() => {
        // Wrap init in timeout to prevent resize loop errors in some browsers
        setTimeout(() => init(), 0);
    });
    resizeObserver.observe(canvas);

    init();
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [maxSize, minSize, particleDensity, particleColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{
        background,
      }}
    />
  );
};

export default SparklesCore;