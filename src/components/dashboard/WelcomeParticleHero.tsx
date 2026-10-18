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

      // Subtle background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Update and project 3D particles
      const projected: { px: number; py: number; alpha: number; size: number }[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx + mouseNormX * 0.3;
        p.y += p.vy + mouseNormY * 0.3;
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

        const alpha = Math.min(1, Math.max(0.1, (1 - p.z / 500) * p.baseAlpha));
        const pSize = p.size * scale * 1.4;

        projected.push({ px, py, alpha, size: pSize });

        // Draw particle node
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(228, 228, 231, ${alpha})`;
        ctx.fill();
      }

      // Draw interactive connections
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            const lineAlpha = (1 - dist / 75) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(228, 228, 231, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
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
    <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40 select-none shadow-lg">
      {/* 3D Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair opacity-75"
      />

      {/* Hero Content Overlay */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between min-h-[280px]">
        <div className="space-y-2.5 max-w-2xl">
          {/* Status Kicker */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LGS Unified Engine v2.6</span>
            <span>·</span>
            <span>Gemini 3.8 Flash Online</span>
            <span>·</span>
            <span>Secure Payments Ready</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            {lang === 'ar'
              ? 'مرحباً بك في استوديو Lovable Gemini الموحد'
              : 'Welcome to Lovable Gemini Studio'}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
            {lang === 'ar'
              ? 'منظومة متكاملة لبناء وتخصيص التطبيقات بالوصف النصي (Prompt-to-App)، تشغيل نماذج Gemini في مختبر متقدم، وتفعيل الاشتراكات الحقيقية وبوابة الدفع المشفرة المعتمدة.'
              : 'End-to-end full-stack app synthesis, Gemini 3.8 multimodal AI playground, and automated serverless deployment with native enterprise secure payments.'}
          </p>
        </div>

        {/* Quick Launchpad Buttons */}
        <div className="pt-6 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('build-studio')}
            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Hammer className="w-3.5 h-3.5 text-zinc-950" />
            <span>{lang === 'ar' ? 'تشغيل استوديو البناء' : 'Launch App Builder'}</span>
            <ArrowRight className="w-3 h-3 text-zinc-950" />
          </button>

          <button
            onClick={() => setActiveTab('ai-lab')}
            className="px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700/80 transition"
          >
            <Bot className="w-3.5 h-3.5 text-zinc-400" />
            <span>{lang === 'ar' ? 'مختبر AI والوكلاء' : 'Open AI Lab & Agents'}</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className="px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700/80 transition"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'الاشتراكات وبوابة الدفع' : 'Billing & Payment Gateway'}</span>
          </button>

          <button
            onClick={() => setActiveTab('deployment')}
            className="px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700/80 transition"
          >
            <CloudUpload className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'النشر على Cloud Run' : 'Deployments & PWA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
