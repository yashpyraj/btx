import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";

export const BentoCard = ({
  src,
  title,
  description,
  isComingSoon,
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

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div className="relative size-full cursor-pointer" onClick={handleClick}>
      {/* Background media */}
      {isVideo ? (
        <video
          src={src}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
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

        {isComingSoon && (
          <button
            type="button"
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHoverOpacity(1)}
            onMouseLeave={() => setHoverOpacity(0)}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
            onClick={(e) => e.stopPropagation()}
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