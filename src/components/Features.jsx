import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  src,
  title,
  description,
  isComingSoon,
  ctaText,
  alt = "bento image",
  poster,
  mediaType,
  onClick,
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  // Detect media type (fallback to override if provided)
  const isVideo =
    mediaType === "video"
      ? true
      : mediaType === "image"
        ? false
        : /\.(mp4|webm|ogg)$/i.test(src);

  const handleMouseMove = (e) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setCursorPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="relative size-full" onClick={onClick}>
      {/* Background media */}
      {isVideo ? (
        <video
          src={src}
          muted
          autoPlay
          loop
          playsInline
          preload="none"
          loading="lazy"
          poster={poster}
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      )}

      {/* Foreground content */}
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          ) : null}
        </div>

        {ctaText && (
          <button
            type="button"
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHoverOpacity(1)}
            onMouseLeave={() => setHoverOpacity(0)}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2 text-xs uppercase text-white font-semibold transition-all duration-300 hover:scale-105"
          >
            {/* Radial gradient hover effect */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #8b5cf6aa, #7c3aed44)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <span className="relative z-20">{ctaText}</span>
          </button>
        )}

        {isComingSoon && (
          <button
            type="button"
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHoverOpacity(1)}
            onMouseLeave={() => setHoverOpacity(0)}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            {/* Radial gradient hover effect */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <span className="relative z-20">coming soon</span>
          </button>
        )}
      </div>
    </div>
  );
};

const Features = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-black pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
          <BentoCard
            src="videos/row.mp4"
            title={
              <>
                row <b>league</b>
              </>
            }
            description="Root of War Tournament - Compete in epic battles and climb the leaderboards."
            ctaText="view tournament"
            onClick={() => navigate("/row-league")}
          />
        </BentoTilt>

        <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-1">
            <BentoCard
              src="img/emry.png"
              title={
                <>
                  <b>cav guide</b>
                </>
              }
              description="Exclusive guide of cavs from Face of Blade."
              ctaText="explore guide"
              onClick={() => navigate("/cav-guide")}
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1">
            <BentoCard
              src="img/lil.png"
              title={
                <>
                  <b>alliance dashboard</b>
                </>
              }
              description="Track progress, compare stats, and unlock a complete overview of yours with gamified insights."
              ctaText="view dashboard"
              onClick={() =>
                window.open(
                  "https://yammydashboard.netlify.app/alliance/98ae3d53-0787-4bc8-8b75-38527eac3796",
                  "_blank"
                )
              }
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1">
            <BentoCard
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
              title={
                <>
                  <b>pet guide</b>
                </>
              }
              description="Complete pet optimization guide - Low, Mid & High spend strategies with detailed stats and recommendations."
              ctaText="explore pets"
              onClick={() => navigate("/pet-guide")}
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1">
            <BentoCard
              src="https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg"
              title={
                <>
                  <b>BTX teams</b>
                </>
              }
              description="Join legendary Greek mythology teams - Zeus, Poseidon, or Hades. Choose your divine alliance and dominate."
              ctaText="choose team"
              onClick={() => navigate("/btx-teams")}
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1">
            <BentoCard
              src="https://images.pexels.com/photos/1568342/pexels-photo-1568342.jpeg"
              title={
                <>
                  <b>memories</b>
                </>
              }
              description="Relive epic moments, legendary battles, and Larnak's lost GH from our journey."
              ctaText="view memories"
              onClick={() => navigate("/memories")}
            />
          </BentoTilt>

          {/* <BentoTilt className="bento-tilt_2">
          <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
            </h1>

            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <video
            src="videos/feature-5.mp4"
            loop
            muted
            autoPlay
            className="size-full object-cover object-center"
          />
        </BentoTilt> */}
        </div>
      </div>
    </section>
  );
};

export default Features;
