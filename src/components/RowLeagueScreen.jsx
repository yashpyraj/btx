"use client";

import { useState, useRef, useMemo, useCallback, useEffect, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { GiCrown } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Story from "../components/Story";

/* -------------------------
   Helper: safe image loader
   ------------------------- */
const useImageFallback = (initialSrc, fallback = "/img/placeholder.webp") => {
  const [src, setSrc] = useState(initialSrc);
  const onError = useCallback(() => setSrc(fallback), [fallback]);
  useEffect(() => setSrc(initialSrc), [initialSrc]);
  return [src, onError];
};

/* -------------------------
   StickyCard component
   ------------------------- */
const StickyCard = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale,
  z,
  isLeader = false,
}) => {
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const scale = useTransform(progress, range, [1, targetScale]);
  const topOffset = `calc(-8vh + ${i * 18 + 180}px)`;
  const [imgSrc, onImgError] = useImageFallback(src);

  const leaderMultiplier = isLeader ? 1.06 : 1;
  const finalScale = shouldReduceMotion ? 1 : scale;

  return (
    <div
      ref={cardRef}
      className="sticky top-0 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        style={{ scale: finalScale, top: topOffset, zIndex: z }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className={`relative -top-1/4 w-[min(70vw,420px)] max-w-[420px] origin-top rounded-2xl overflow-hidden shadow-xl pointer-events-auto ${
          isLeader ? "ring-2 ring-red-400/30 backdrop-blur-sm" : ""
        }`}
      >
        <img
          src={imgSrc}
          alt={title}
          onError={onImgError}
          className="block w-full h-auto object-contain bg-black"
          loading="lazy"
          decoding="async"
          style={{ transform: `scale(${isLeader ? leaderMultiplier : 1})` }}
        />

        {isLeader && (
          <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/90 to-orange-400/90 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
            <GiCrown size={14} /> LEADER
          </div>
        )}

        <div className="absolute left-3 bottom-3 rounded-md bg-black/60 px-2 py-0.5 text-xs backdrop-blur-sm text-white">
          <span className="font-semibold">{title}</span>
          <span className="ml-2 opacity-70">#{i + 1}</span>
        </div>
      </motion.div>
    </div>
  );
};

/* -----------------------------------------
   Improved Character + AnimatedText (shiny)
   -----------------------------------------
   - slower/eased animations
   - shiny silver gradient + shimmer
   - reduced-motion support
   - memoized Character for perf
------------------------------------------*/

/* Character — memoized for performance */
const Character = memo(function Character({
  char,
  index,
  centerIndex,
  scrollYProgress,
  prefersReduced,
}) {
  const isSpace = char === " ";
  // normalized distance from center (-1 .. 1)
  const distance = (index - centerIndex) / Math.max(1, centerIndex);

  // Slow, subtle transforms for a refined look
  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    [distance * -10, distance * 10]
  );
  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    [distance * 12, distance * -12]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1 - Math.abs(distance) * 0.02, 1 + Math.abs(distance) * 0.03]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    [0.88 + Math.abs(distance) * -0.15, 1]
  );

  const finalStyle = prefersReduced
    ? { y: 0, rotateX: 0, scale: 1, opacity: 1 }
    : { y: translateY, rotateX, scale, opacity };

  // entrance animation (staggered slightly)
  const entrance = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: index * 0.03,
      duration: 0.9,
      ease: [0.22, 0.8, 0.36, 0.97],
    },
  };

  return (
    <motion.span
      className={`inline-block char ${isSpace ? "w-4" : ""}`}
      {...entrance}
      style={finalStyle}
      aria-hidden={isSpace}
    >
      {char}
    </motion.span>
  );
});

/* AnimatedText — uses shiny silver shimmer and slower motion */
const AnimatedText = ({ text = "Welcome to our ROW League showcase" }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const prefersReduced = useReducedMotion();

  const characters = useMemo(() => text.split(""), [text]);
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <div
      ref={targetRef}
      className="relative box-border flex h-[120vh] items-center justify-center gap-[2vw] overflow-hidden p-[2vw]"
    >
      {/* local CSS for shimmer + character smoothing */}
      <style>{`
        .shimmer {
          background: linear-gradient(90deg, #bfc3c7 0%, #ffffff 45%, #bfc3c7 55%, #c7c7c9 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 3.6s linear infinite;
          text-shadow: 0 1px 0 rgba(255,255,255,0.85), 0 8px 24px rgba(0,0,0,0.45);
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .char {
          display: inline-block;
          will-change: transform, opacity;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        /* small interactive pop (non-essential) */
        .char:hover { transform: translateY(-6px) scale(1.02); }
      `}</style>

      <div
        className="w-full max-w-4xl text-center text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter"
        style={{ perspective: "900px" }}
      >
        <span className="shimmer">
          {characters.map((char, index) => (
            <Character
              key={index}
              char={char}
              index={index}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
              prefersReduced={prefersReduced}
            />
          ))}
        </span>
      </div>
    </div>
  );
};

/* -------------------------
   CardStack component
   ------------------------- */
const CardStack = ({ projectsList, leaderIndex: leaderIndexProp }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const projects = useMemo(
    () =>
      projectsList || [
        { title: "Team Captain", src: "/img/shiso.png" },
        { title: "Strategy Lead", src: "/img/esvipe.png" },
        { title: "Combat Specialist", src: "/img/fob.png" },
        { title: "Combat Specialist", src: "/img/joker.png" },
      ],
    [projectsList]
  );

  const leaderIndex = 0;

  return (
    <section
      ref={container}
      className="relative flex w-full flex-col items-center justify-center min-h-[60vh] pb-[60vh] pt-[20vh]"
    >
      <div className="absolute left-1/2 top-[8%] -translate-x-1/2 text-center">
        <span className="relative max-w-[14ch] text-xs uppercase leading-tight opacity-40 text-white">
          scroll down to view the team
        </span>
      </div>

      {projects.map((project, i) => {
        const zIndex = projects.length - i + (i === leaderIndex ? 10 : 0);
        const baseTarget = Math.max(0.55, 1 - (projects.length - i - 1) * 0.08);
        const targetScale = i === leaderIndex ? baseTarget * 1.06 : baseTarget;
        const rangeStart = Math.max(0, i * (1 / Math.max(4, projects.length)));

        return (
          <StickyCard
            key={`p_${i}`}
            i={i}
            title={project.title}
            src={project.src}
            progress={scrollYProgress}
            range={[rangeStart, 1]}
            targetScale={targetScale}
            z={zIndex}
            isLeader={i === leaderIndex}
          />
        );
      })}
    </section>
  );
};

/* -------------------------
   Screen: RowLeagueScreen
   ------------------------- */
const RowLeagueScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-black/60 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="rounded-full p-2 hover:bg-white/10 transition-colors"
          >
            <IoArrowBack size={18} />
          </button>
          <div>
            <h1 className="text-lg font-semibold">ROW League</h1>
            <p className="text-xs opacity-60">Team Showcase • Season 2025</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="rounded-full p-2 hover:bg-white/10 transition-colors"
        >
          <IoClose size={18} />
        </button>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl">
        {/* Center Story component */}
        <section className="flex min-h-screen items-center justify-center">
          <Story />
        </section>
  <h1>Leads</h1>
        {/* Card stack under story */}
        <CardStack />
      </main>

    <h1>Player List</h1>
    </div>
  );
};

export default RowLeagueScreen;
