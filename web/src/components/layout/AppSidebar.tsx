import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/App";
import { useLocation } from "wouter";
import { motion, useMotionValue, useTransform, animate, useSpring, type MotionValue } from "framer-motion";
import {
  Home, Database, Lock, ArrowLeftRight, Shield,
  Percent, Map, Users, Sun, Moon, X, Layers,
} from "lucide-react";

const navItems = [
  { label: "About",      icon: Home,           href: "/" },
  { label: "Ecosystem",  icon: Layers,         href: "/ecosystem" },
  { label: "Vault",      icon: Database,       href: "/vault" },
  { label: "gitShield",  icon: Lock,           href: "/gitlock" },
  { label: "gitSwap",    icon: ArrowLeftRight, href: "/gitswap" },
  { label: "Security",   icon: Shield,         href: "/security" },
  { label: "Fees",       icon: Percent,        href: "/fees" },
  { label: "Roadmap",    icon: Map,            href: "/roadmap" },
  { label: "Community",  icon: Users,          href: "/community" },
];

const SIDEBAR_W  = 220;
const HANDLE_W   = 48;
const CLOSED_X   = -(SIDEBAR_W - HANDLE_W);

/* ── Twinkling dot background canvas ─────────────────────────── */
const BOX_H = 46;

function TwinkleDotBg({ w, h }: { w: number; h: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || w === 0 || h === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PX = 3, GAP = 4, PITCH = PX + GAP;
    const cols = Math.floor(w / PITCH);
    const rows = Math.floor(h / PITCH);

    const dots: { phase: number; speed: number }[] = [];
    for (let i = 0; i < cols * rows; i++) {
      const n  = Math.sin(i * 127.1 + 311.7) * 43758.5;
      const n2 = Math.sin(i * 311.7 + 127.1) * 12345.6;
      dots.push({
        phase: (n  - Math.floor(n))  * Math.PI * 2,
        speed: 0.4 + (n2 - Math.floor(n2)) * 0.9,
      });
    }

    function draw(ts: number) {
      const t = ts / 1000;
      ctx!.clearRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dot   = dots[r * cols + c];
          const alpha = 0.06 + 0.22 * (0.5 + 0.5 * Math.sin(dot.phase + t * dot.speed));
          ctx!.fillStyle = `hsla(231,55%,62%,${alpha.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(c * PITCH + PX / 2, r * PITCH + PX / 2, PX / 2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [w, h]);

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      style={{ display: "block", position: "absolute", inset: 0 }}
    />
  );
}

/* ── Animated logo box (full width) ─────────────────────────── */
function AnimatedSidebarLogo() {
  const [boxW, setBoxW] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const obs = new ResizeObserver((e) => setBoxW(e[0].contentRect.width));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className="w-full overflow-hidden border border-border relative"
      style={{ height: BOX_H, borderRadius: 0 }}
    >
      {boxW > 0 && <TwinkleDotBg w={boxW} h={BOX_H} />}
      <div className="absolute inset-0 flex items-center justify-center z-10" style={{ pointerEvents: "none" }}>
        <div style={{ animation: "sidebarShatter 5s linear infinite" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <img
              src="/logo.png"
              alt="Gitbank"
              style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
            />
            <span
              className="font-semibold text-[15px] tracking-tight"
              style={{ color: "hsl(var(--sidebar-foreground))", lineHeight: 1 }}
            >
              Gitbank
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes sidebarShatter {
          0%,60%   { transform:translate(0,0) scale(1) skewX(0deg); filter:none; opacity:1; }
          62%  { transform:translate(-5px,1px)   scale(1.03) skewX(-4deg);  filter:blur(0.5px) contrast(1.8) hue-rotate(30deg);  opacity:0.88; }
          64%  { transform:translate(8px,-2px)   scale(0.95) skewX(7deg);   filter:blur(1.5px) contrast(2.5) hue-rotate(90deg);  opacity:0.65; }
          66%  { transform:translate(-10px,3px)  scale(1.07) skewX(-10deg); filter:blur(3px)   contrast(4)   hue-rotate(160deg); opacity:0.4;  }
          68%  { transform:translate(14px,-4px)  scale(0.88) skewX(13deg);  filter:blur(5px)   contrast(6)   hue-rotate(220deg); opacity:0.18; }
          70%  { transform:translate(-16px,5px)  scale(1.12) skewX(-16deg); filter:blur(7px)   contrast(8)   hue-rotate(300deg); opacity:0.05; }
          72%  { transform:translate(0,0) scale(1.2) skewX(0deg); filter:blur(8px) contrast(1) hue-rotate(360deg); opacity:0; }
          74%  { transform:translate(12px,-4px)  scale(0.9)  skewX(12deg);  filter:blur(6px)   contrast(6)   hue-rotate(270deg); opacity:0.1;  }
          76%  { transform:translate(-8px,3px)   scale(1.06) skewX(-8deg);  filter:blur(4px)   contrast(4)   hue-rotate(180deg); opacity:0.3;  }
          78%  { transform:translate(5px,-2px)   scale(0.96) skewX(5deg);   filter:blur(2px)   contrast(2.5) hue-rotate(90deg);  opacity:0.55; }
          80%  { transform:translate(-3px,1px)   scale(1.02) skewX(-2deg);  filter:blur(0.8px) contrast(1.5) hue-rotate(30deg);  opacity:0.8;  }
          82%  { transform:translate(1px,0px)    scale(0.99) skewX(1deg);   filter:blur(0.2px) contrast(1.1);                    opacity:0.95; }
          84%,100% { transform:translate(0,0) scale(1) skewX(0deg); filter:none; opacity:1; }
        }
      `}</style>
    </div>
  );
}

/* ── Static logo (mobile / handle icon) ─────────────────────── */
function StaticLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo.png" alt="Gitbank" className="w-7 h-7 rounded-lg flex-shrink-0 object-cover" />
      <span className="font-semibold text-[15px] text-sidebar-foreground tracking-tight">Gitbank</span>
    </div>
  );
}

/* ── Nav content ─────────────────────────────────────────────── */
function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const { dark, toggle } = useTheme();
  const [location, navigate] = useLocation();

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location === href || location.startsWith(href + "/");

  const go = (href: string) => { navigate(href); onNavigate?.(); };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-2 pb-1 flex-1">
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <button
                key={item.label}
                onClick={() => go(item.href)}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors w-full text-left ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon size={15} strokeWidth={1.75} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pb-4 flex flex-col gap-3">
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          {dark ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
          <span>{dark ? "Light" : "Dark"}</span>
        </button>
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-2">
          {["Docs", "Privacy", "Terms"].map((link) => (
            <button
              key={link}
              onClick={() => go(link === "Docs" ? "/docs" : `/${link.toLowerCase()}`)}
              className="text-[11px] text-muted-foreground hover:text-sidebar-foreground transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Logo pull-handle ────────────────────────────────────────── */
function LogoHandle({
  x,
  open,
  onToggle,
}: {
  x: MotionValue<number>;
  open: boolean;
  onToggle: () => void;
}) {
  /* progress 0→1 as sidebar opens */
  const progress = useTransform(x, [CLOSED_X, 0], [0, 1]);

  /* logo rotates 0→180deg as it opens */
  const rotate = useTransform(progress, [0, 1], [0, 180]);

  /* glow ring fades in as it opens */
  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.55, 0.8, 0]);

  /* scale the handle slightly bigger when open (shows X cue) */
  const scale = useSpring(useTransform(progress, [0, 1], [1, 1.08]), {
    stiffness: 300,
    damping: 30,
  });

  return (
    <motion.button
      onClick={onToggle}
      className="absolute top-1/2 -translate-y-1/2 z-50 flex items-center justify-center cursor-grab active:cursor-grabbing focus:outline-none"
      style={{ right: -22, scale }}
      aria-label={open ? "Close navigation" : "Open navigation"}
    >
      {/* Glow ring */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          opacity: glowOpacity,
          boxShadow: "0 0 0 4px hsl(231 70% 62% / 0.35), 0 0 18px 4px hsl(231 60% 55% / 0.3)",
          borderRadius: "50%",
        }}
      />

      {/* Logo disc */}
      <motion.div
        style={{ rotate }}
        className="relative w-11 h-11 rounded-full bg-sidebar border-2 border-sidebar-border shadow-lg flex items-center justify-center overflow-hidden"
      >
        {/* Twinkling dots behind logo */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, hsl(231 55% 62% / 0.18) 0%, transparent 70%)",
          }}
        />
        <img
          src="/logo.png"
          alt="Gitbank"
          className="w-7 h-7 rounded-full object-cover relative z-10"
          draggable={false}
        />
      </motion.div>

      {/* X badge when open */}
      <motion.span
        style={{ opacity: progress, scale: useTransform(progress, [0, 1], [0.5, 1]) }}
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background border border-border shadow-sm flex items-center justify-center"
      >
        <X size={9} className="text-foreground" />
      </motion.span>
    </motion.button>
  );
}

/* ── Root export ─────────────────────────────────────────────── */
export default function AppSidebar() {
  const [open, setOpen]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, navigate]        = useLocation();

  /* framer-motion x value: 0 = fully open, CLOSED_X = collapsed to handle */
  const x        = useMotionValue(CLOSED_X);
  const backdropOpacity = useTransform(x, [CLOSED_X, 0], [0, 1]);

  const snapOpen = () => {
    animate(x, 0,        { type: "spring", stiffness: 320, damping: 32 });
    setOpen(true);
  };
  const snapClosed = () => {
    animate(x, CLOSED_X, { type: "spring", stiffness: 320, damping: 32 });
    setOpen(false);
  };
  const toggle = () => (open ? snapClosed() : snapOpen());

  function onDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x > 40)  snapOpen();
    else if (info.offset.x < -40) snapClosed();
    else open ? snapOpen() : snapClosed();
  }

  return (
    <>
      {/* ── DESKTOP swipeable drawer ── */}
      <div className="hidden md:block">

        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[3px]"
          style={{ opacity: backdropOpacity, pointerEvents: open ? "auto" : "none" }}
          onClick={snapClosed}
        />

        {/* Sidebar drawer */}
        <motion.aside
          drag="x"
          dragConstraints={{ left: CLOSED_X, right: 0 }}
          dragElastic={0.06}
          onDragEnd={onDragEnd}
          style={{ x, width: SIDEBAR_W, touchAction: "none" }}
          className="fixed left-0 top-0 h-screen flex flex-col bg-sidebar border-r border-sidebar-border z-40 select-none"
        >
          {/* Animated logo banner — click toggles */}
          <div className="cursor-pointer shrink-0" onClick={toggle}>
            <AnimatedSidebarLogo />
          </div>

          {/* Nav content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ width: SIDEBAR_W }}>
            <NavContent onNavigate={snapClosed} />
          </div>

          {/* ── Logo pull-handle — right edge of collapsed sidebar ── */}
          <LogoHandle x={x} open={open} onToggle={toggle} />
        </motion.aside>
      </div>

      {/* ── MOBILE top bar ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
        <button onClick={() => navigate("/")} className="flex items-center">
          <StaticLogo />
        </button>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* ── MOBILE drawer ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside
            className="relative w-[220px] flex flex-col bg-sidebar border-r border-sidebar-border h-full"
            style={{ animation: "slideInLeft 0.2s ease-out" }}
          >
            <div className="px-4 py-4 flex items-center justify-between border-b border-sidebar-border">
              <StaticLogo />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                aria-label="Close menu"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-2">
              <NavContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
