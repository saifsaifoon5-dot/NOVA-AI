import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Hammer,
  Bot,
  CreditCard,
  CloudUpload,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  baseAlpha: number;
}

export const WelcomeParticleHero: React.FC = () => {
  const { lang, setActiveTab } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 280);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 280;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates with easing
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Generate 3D particle nodes
    const PARTICLE_COUNT = 65;
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: Math.random() * 400 + 100, // Depth
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.8 + 1,
        baseAlpha: Math.random() * 0.4 + 0.3,
      });
    }

    const focalLength = 300;

    const render = () => {
      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const mouseNormX = (mouseX - width / 2) / width;
      const mouseNormY = (mouseY - height / 2) / height;

      ctx.clearRect(0, 0, width, height);

      // Deep obsidian ambient vignette
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width * 0.7);
      bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
      bgGrad.addColorStop(0.5, 'rgba(9, 9, 11, 0.95)');
      bgGrad.addColorStop(1, 'rgba(3, 7, 18, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // High-contrast architectural grid lines with subtle intersections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and project 3D luminous particles
      const projected: { px: number; py: number; alpha: number; size: number; isCyan: boolean }[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx + mouseNormX * 0.4;
        p.y += p.vy + mouseNormY * 0.4;
        p.z += p.vz;

        // Boundary wrap
        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;
        if (p.z < 50) p.z = 500;
        if (p.z > 500) p.z = 50;

        // 3D perspective projection
        const scale = focalLength / (focalLength + p.z);
        const px = width / 2 + p.x * scale;
        const py = height / 2 + p.y * scale;

        const alpha = Math.min(1, Math.max(0.2, (1 - p.z / 500) * p.baseAlpha * 1.5));
        const pSize = p.size * scale * 1.8;
        const isCyan = i % 2 === 0;

        projected.push({ px, py, alpha, size: pSize, isCyan });

        // Draw luminous particle node
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fillStyle = isCyan ? `rgba(56, 189, 248, ${alpha})` : `rgba(52, 211, 153, ${alpha})`;
        ctx.shadowColor = isCyan ? '#38bdf8' : '#34d399';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw high-contrast interactive laser connections
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const lineAlpha = (1 - dist / 85) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = p1.isCyan
              ? `rgba(56, 189, 248, ${lineAlpha})`
              : `rgba(52, 211, 153, ${lineAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 select-none shadow-2xl">
      {/* 3D Canvas Layer with deep contrast */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair opacity-90"
      />

      {/* Hero Content Overlay */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[300px]">
        <div className="space-y-3 max-w-3xl">
          {/* Status Kicker with Official Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === 'ar' ? 'نظام NOVA السيادي v2.8' : 'NOVA Sovereign Engine v2.8'}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold">
              {lang === 'ar' ? 'محرك NOVA المعماري' : 'NOVA Architecture Engine'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold">
              {lang === 'ar' ? 'بوابات سداد مشفرة 3D Secure' : '3D Secure Payments & ZATCA'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {lang === 'ar'
              ? 'استوديو هندسة وتوليد المنظومات البرمجية بالذكاء الاصطناعي'
              : 'Autonomous Software Engineering & Full-Stack AI Studio'}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl font-medium">
            {lang === 'ar'
              ? 'توليد وبناء التطبيقات البرمجية الحقيقية من الصفر، تفكيك المتطلبات والمهام تلقائياً، تكامل قواعد بيانات PostgreSQL، وربط بوابات الدفع المشفرة المعتمدة مع إصدار فواتير ZATCA الإلكترونية.'
              : 'Full-stack application synthesis from scratch, autonomous task planning & triage, PostgreSQL relational schemas, and enterprise payment gateways with ZATCA Phase 2 compliance.'}
          </p>
        </div>

        {/* Quick Launchpad Buttons */}
        <div className="pt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('build-studio')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold flex items-center gap-2 transition shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Hammer className="w-4 h-4 text-zinc-950" />
            <span>{lang === 'ar' ? 'تشغيل استوديو البناء الذكي' : 'Launch Build Studio'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
          </button>

          <button
            onClick={() => setActiveTab('ai-lab')}
            className="px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 text-zinc-200 text-xs font-bold flex items-center gap-2 border border-zinc-750 transition active:scale-95 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>{lang === 'ar' ? 'مختبر النماذج والوكلاء' : 'AI Models & Agents Lab'}</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className="px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 text-zinc-200 text-xs font-bold flex items-center gap-2 border border-zinc-750 transition active:scale-95 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ar' ? 'الاشتراكات وبوابة الدفع' : 'Billing & Payment Gateway'}</span>
          </button>

          <button
            onClick={() => setActiveTab('deployment')}
            className="px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 text-zinc-200 text-xs font-bold flex items-center gap-2 border border-zinc-750 transition active:scale-95 cursor-pointer"
          >
            <CloudUpload className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'النشر السحابي و PWA' : 'Cloud Deployments & PWA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
