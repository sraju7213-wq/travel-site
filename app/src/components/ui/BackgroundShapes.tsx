"use client";

import { useEffect, useRef } from "react";

export default function BackgroundShapes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const shapes: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      color: string;
      type: "circle" | "triangle" | "square";
    }> = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.scale(dpr, dpr);
    };

    const initShapes = () => {
      shapes.length = 0;
      const count = Math.min(12, Math.max(6, Math.floor((width * height) / 150000)));
      const colors = [
        "rgba(177, 138, 81, 0.08)",   // brass
        "rgba(255, 110, 0, 0.06)",    // wild orange
        "rgba(129, 113, 98, 0.05)",   // wild sand
        "rgba(22, 39, 26, 0.08)",     // forest
      ];

      for (let i = 0; i < count; i++) {
        const type = ["circle", "triangle", "square"][Math.floor(Math.random() * 3)] as "circle" | "triangle" | "square";
        shapes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 120 + 60,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          type,
        });
      }
    };

    const drawShape = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      type: "circle" | "triangle" | "square"
    ) => {
      ctx.beginPath();
      switch (type) {
        case "circle":
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          break;
        case "triangle":
          ctx.moveTo(x, y - radius);
          ctx.lineTo(x + radius * 0.866, y + radius * 0.5);
          ctx.lineTo(x - radius * 0.866, y + radius * 0.5);
          ctx.closePath();
          break;
        case "square":
          const half = radius * 0.707;
          ctx.rect(x - half, y - half, half * 2, half * 2);
          break;
      }
      ctx.fill();
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      shapes.forEach((shape) => {
        shape.x += shape.vx;
        shape.y += shape.vy;

        if (shape.x < -shape.radius) shape.x = width + shape.radius;
        if (shape.x > width + shape.radius) shape.x = -shape.radius;
        if (shape.y < -shape.radius) shape.y = height + shape.radius;
        if (shape.y > height + shape.radius) shape.y = -shape.radius;

        ctx.save();
        ctx.globalAlpha = shape.opacity;
        ctx.fillStyle = shape.color;
        drawShape(ctx, shape.x, shape.y, shape.radius, shape.type);
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resize();
      initShapes();
    };

    window.addEventListener("resize", handleResize);
    resize();
    initShapes();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}