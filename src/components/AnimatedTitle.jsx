import { gsap } from "gsap";
import { useEffect, useRef, memo } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const parseWord = (word) => {
  const boldRegex = /<b>(.*?)<\/b>/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(word)) !== null) {
    if (match.index > lastIndex) {
      parts.push(word.slice(lastIndex, match.index));
    }
    parts.push(<b key={match.index}>{match[1]}</b>);
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < word.length) {
    parts.push(word.slice(lastIndex));
  }

  return parts.length > 0 ? parts : word;
};

const AnimatedTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "100 bottom",
          end: "center bottom",
          toggleActions: "play none none reverse",
        },
      });

      titleAnimation.to(
        ".animated-word",
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
          ease: "power2.inOut",
          stagger: 0.02,
        },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={clsx("animated-title", containerClass)}>
      {title.split("<br />").map((line, index) => (
        <div
          key={index}
          className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3"
        >
          {line.split(" ").map((word, idx) => (
            <span key={idx} className="animated-word">
              {parseWord(word)}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
