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

  // bump leader slightly more and add subtle pulse using spring transition
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
        className={`relative -top-1/4 w-[min(86vw,640px)] max-w-[640px] origin-top rounded-3xl overflow-hidden shadow-2xl pointer-events-auto
          ${isLeader ? "ring-2 ring-white/12 backdrop-blur-sm" : ""}`}
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
        { title: "Project 5", src: "/img/gallery-6.webp" },
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
          // the leader gets a slightly larger target
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
   DemoSkiper16 - showcase, highlight center leader by default
   - change leaderIndex to highlight different card
   ------------------------------ */
const DemoSkiper16 = ({ leaderIndex } = {}) => {
  const demoProjects = useMemo(
    () => [
      { title: "Project 1", src: "/img/gallery-2.webp" },
      { title: "Project 2", src: "/img/gallery-3.webp" },
      { title: "Project 3", src: "/img/gallery-4.webp" },
      { title: "Project 4", src: "/img/gallery-5.webp" },
      { title: "Project 5", src: "/img/gallery-6.webp" },
    ],
    []
  );

  return <Skiper16 projectsList={demoProjects} leaderIndex={leaderIndex} />;
};

/* ------------------------------
   RowLeagueScreen - showcase page
   ------------------------------ */
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

        <div className="flex items-center gap-3">
          <button className="rounded-md px-3 py-1 text-xs hover:bg-white/5">
            <IoTrophy className="inline-block mr-1" /> Leaderboard
          </button>
          <button className="rounded-md px-3 py-1 text-xs hover:bg-white/5">
            <IoCalendar className="inline-block mr-1" /> Schedule
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 p-6">
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="col-span-2 rounded-2xl border border-white/6 p-6">
            <h2 className="mb-2 text-2xl font-semibold">Row League Showcase</h2>
            <p className="mb-4 text-sm opacity-70">
              A small showcase section for Row League — highlights, featured
              projects, and the interactive card stack demo below. The centered
              card is highlighted as the current lead of the row.
            </p>

            <div className="mb-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-xs">
                <GiCrown /> Top Division
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-xs">
                <GiTreasureMap /> Next Match: Sep 20, 2025
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-xs">
                <IoSparkles /> Featured
              </span>
            </div>

            <div className="rounded-xl border border-white/5 p-4">
              {/* default: leader = center card */}
              <DemoSkiper16 />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export { Skiper16, StickyCard_001, DemoSkiper16 };
export default RowLeagueScreen;