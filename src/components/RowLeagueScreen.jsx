import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { GiCrown } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

// Helper: safe image loader with fallback
const useImageFallback = (initialSrc, fallback = "/img/placeholder.webp") => {
  const [src, setSrc] = useState(initialSrc);
  const onError = useCallback(() => setSrc(fallback), [fallback]);
  useEffect(() => setSrc(initialSrc), [initialSrc]);
  return [src, onError];
};

// StickyCard component
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
        className={`relative -top-1/4 w-[min(86vw,640px)] max-w-[640px] origin-top rounded-3xl overflow-hidden shadow-2xl pointer-events-auto ${
          isLeader ? "ring-2 ring-red-400/30 backdrop-blur-sm" : ""
        }`}
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

        {isLeader && (
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/90 to-orange-400/90 px-3 py-1 text-xs font-semibold text-white shadow">
            <GiCrown size={14} /> LEADER
          </div>
        )}

        <div className="absolute left-4 bottom-4 rounded-md bg-black/60 px-3 py-1 text-sm backdrop-blur-sm text-white">
          <span className="font-semibold">{title}</span>
          <span className="ml-2 text-xs opacity-70">#{i + 1}</span>
        </div>
      </motion.div>
    </div>
  );
};

// Character component for animated text
const Character = ({ char, index, centerIndex, scrollYProgress }) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0]
  );

  return (
    <motion.span
      className={`inline-block text-red-400 ${isSpace ? "w-4" : ""}`}
      style={{ x, rotate }}
    >
      {char}
    </motion.span>
  );
};

// Animated text component
const AnimatedText = ({ text = "Welcome to our ROW League showcase" }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const characters = useMemo(() => text.split(""), [text]);
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <div
      ref={targetRef}
      className="relative box-border flex h-[210vh] items-center justify-center gap-[2vw] overflow-hidden p-[2vw]"
    >
      <div
        className="w-full max-w-4xl text-center text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter text-white"
        style={{ perspective: "500px" }}
      >
        {characters.map((char, index) => (
          <Character
            key={index}
            char={char}
            index={index}
            centerIndex={centerIndex}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
};

// Card stack component
const CardStack = ({ projectsList, leaderIndex: leaderIndexProp }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const projects = useMemo(
    () =>
      projectsList || [
        { title: "Team Captain", src: "/img/gallery-2.webp" },
        { title: "Strategy Lead", src: "/img/gallery-3.webp" },
        { title: "Combat Specialist", src: "/img/gallery-4.webp" },
        { title: "Support Player", src: "/img/gallery-5.webp" },
      ],
    [projectsList]
  );

  const leaderIndex =
    typeof leaderIndexProp === "number"
      ? leaderIndexProp
      : Math.floor(projects.length / 2);

  return (
    <section
      ref={container}
      className="relative flex w-full flex-col items-center justify-center min-h-[60vh] pb-[90vh] pt-[40vh]"
    >
      <div className="absolute left-1/2 top-[8%] -translate-x-1/2 text-center">
        <span className="relative max-w-[14ch] text-xs uppercase leading-tight opacity-40 text-white">
          scroll down to view the team
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

const RowLeagueScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-black/60 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
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
          onClick={() => navigate('/')}
          className="rounded-full p-2 hover:bg-white/10 transition-colors"
        >
          <IoClose size={18} />
        </button>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl">
        <AnimatedText text="Welcome to our ROW League showcase" />
        <CardStack />
      </main>
    </div>
  );
};

export default RowLeagueScreen;