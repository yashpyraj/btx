"use client";

import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import ReactLenis from "lenis/react";
import { IoArrowBack, IoTrophy, IoCalendar, IoSparkles } from "react-icons/io5";
import { GiCrown, GiTreasureMap } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

/* ------------------------------
   Helper: safe image loader with fallback
   ------------------------------ */
const useImageFallback = (initialSrc, fallback = "/img/placeholder.webp") => {
  const [src, setSrc] = useState(initialSrc);
  const onError = useCallback(() => setSrc(fallback), [fallback]);
  useEffect(() => setSrc(initialSrc), [initialSrc]);
  return [src, onError];
};

/* ------------------------------
   StickyCard_001 (improved)
   - accepts isLeader
   ------------------------------ */
const StickyCard_001 = ({
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

  // leader visual tweaks
  const leaderMultiplier = isLeader ? 1.06 : 1;
  const finalScale = shouldReduceMotion ? 1 : scale;
  const styleScale = isLeader ? finalScale : finalScale;

  return (
    <div
      ref={cardRef}
      className="sticky top-0 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        style={{ scale: styleScale, top: topOffset, zIndex: z }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className={`relative -top-1/4 w-[min(86vw,640px)] max-w-[640px] origin-top rounded-3xl overflow-hidden shadow-2xl pointer-events-auto ${
          isLeader ? "ring-2 ring-white/12 backdrop-blur-sm" : ""
        }`}
        aria-label={`project-card-${i}`}
      >
        <img
          src={imgSrc}
          alt={title}
          onError={onImgError}
          className="block h-[360px] w-full object-cover sm:h-[420px] md:h-[460px] lg:h-[480px]"
          loading="lazy"
          decoding="async"
          style={{ transform: `scale(${isLeader ? leaderMultiplier : 1})` }}
        />

        {/* Leader badge */}
        {isLeader && (
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500/90 to-orange-400/90 px-3 py-1 text-xs font-semibold text-black shadow">
            <GiCrown size={14} /> LEAD
          </div>
        )}

        <div className="absolute left-4 bottom-4 rounded-md bg-black/60 px-3 py-1 text-sm backdrop-blur-sm">
          <span className="font-semibold">{title}</span>
          <span className="ml-2 text-xs opacity-70">#{i + 1}</span>
        </div>
      </motion.div>
    </div>
  );
};

/* ------------------------------
   Skiper16 — main stacked cards
   - supports leaderIndex (defaults to middle)
   ------------------------------ */
const Skiper16 = ({ projectsList, leaderIndex: leaderIndexProp }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const projects = useMemo(
    () =>
      projectsList || [
        { title: "Project 1", src: "/img/gallery-2.webp" },
        { title: "Project 2", src: "/img/gallery-3.webp" },
        { title: "Project 3", src: "/img/gallery-4.webp" },
        { title: "Project 4", src: "/img/gallery-5.webp" },
      ],
    [projectsList]
  );

  // default leader to center if not provided
  const leaderIndex =
    typeof leaderIndexProp === "number"
      ? leaderIndexProp
      : Math.floor(projects.length / 2);

  return (
    <ReactLenis root>
      <section
        ref={container}
        className="relative flex w-full flex-col items-center justify-center min-h-[60vh] pb-[90vh] pt-[40vh]"
        aria-roledescription="project stack"
      >
        <div className="absolute left-1/2 top-[8%] -translate-x-1/2 text-center">
          <span className="relative max-w-[14ch] text-xs uppercase leading-tight opacity-40">
            scroll down to view the card stack
          </span>
        </div>

        {projects.map((project, i) => {
          const zIndex = projects.length - i + (i === leaderIndex ? 10 : 0);
          const baseTarget = Math.max(
            0.55,
            1 - (projects.length - i - 1) * 0.08
          );
          const targetScale =
            i === leaderIndex ? baseTarget * 1.06 : baseTarget;
          const rangeStart = Math.max(
            0,
            i * (1 / Math.max(4, projects.length))
          );

          return (
            <StickyCard_001
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
    </ReactLenis>
  );
};

/* ------------------------------
   Character / Skiper31 components (integrated)
   - lightweight, optimized to avoid repeated hooks
   ------------------------------ */

const cn = (...args) => args.filter(Boolean).join(" ");

const Character = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
  variant = 1,
}) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  // shared transforms
  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * (variant === 3 ? 90 : 50), 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5],
    [variant === 2 || variant === 3 ? 0.75 : 1, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.5],
    [
      variant === 2
        ? Math.abs(distanceFromCenter) * 50
        : variant === 3
          ? -Math.abs(distanceFromCenter) * 20
          : 0,
      0,
    ]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * (variant === 3 ? 50 : 50), 0]
  );

  const commonStyle = { x, scale, y, transformOrigin: "center" };

  if (variant === 1) {
    return (
      <motion.span
        className={cn("inline-block text-orange-500", isSpace && "w-4")}
        style={{ x, rotate }}
      >
        {char}
      </motion.span>
    );
  }

  // variants 2 & 3 use <img> to show icons
  return (
    <motion.img
      src={char}
      className={cn("inline-block", isSpace && "w-4")}
      style={variant === 3 ? { ...commonStyle, rotate } : commonStyle}
    />
  );
};

const Skiper31Demo = ({ text = "see more from gxuri", icons = undefined }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const characters = useMemo(() => text.split(""), [text]);
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <ReactLenis root>
      <main className="w-full bg-transparent">
        <div
          ref={targetRef}
          className="relative box-border flex h-[210vh] items-center justify-center gap-[2vw] overflow-hidden p-[2vw]"
        >
          <div
            className="font-geist w-full max-w-4xl text-center text-6xl font-bold uppercase tracking-tighter text-black"
            style={{ perspective: "500px" }}
          >
            {characters.map((char, index) => (
              <Character
                key={index}
                char={char}
                index={index}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
                variant={1}
              />
            ))}
          </div>
        </div>
      </main>
    </ReactLenis>
  );
};

const Bracket = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 27 78"
    className={className}
  >
    <path
      fill="#000"
      d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
    ></path>
  </svg>
);


const RowLeagueScreen = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/6 bg-black/60 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 hover:bg-white/5"
            aria-label="go-back"
          >
            <IoArrowBack size={18} />
          </button>

          <div>
            <h1 className="text-lg font-semibold">Row League</h1>
            <p className="text-xs opacity-60">Showcase • Season 2025</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 p-6">
        <Skiper31Demo text={"see more from gxuri"} />
        <Skiper16 />
      </main>
    </div>
  );
};

export { Skiper16, StickyCard_001, Skiper31Demo };
export default RowLeagueScreen;
