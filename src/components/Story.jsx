import gsap from "gsap";
import { useRef, useEffect } from "react";

import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";

const FloatingImage = () => {
  const frameRef = useRef(null);
  const proxyRef = useRef({ rx: 0, ry: 0 }); // current animated values
  const tweenRef = useRef(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    // Initial styles for better GPU performance & proper 3D rendering
    gsap.set(el, {
      transformStyle: "preserve-3d",
      transformOrigin: "center center",
      willChange: "transform",
      // set an initial tiny rotation so GPU has a consistent transform on start
      rotateX: 0,
      rotateY: 0,
    });

    // Cleanup on unmount
    return () => {
      if (tweenRef.current) tweenRef.current.kill();
      gsap.set(el, { rotateX: 0, rotateY: 0 });
    };
  }, []);

  // pointermove handler computes target angles and animates proxy -> DOM
  const handlePointerMove = (e) => {
    const el = frameRef.current;
    if (!el) return;

    // Use pointer coordinates relative to element
    const rect = el.getBoundingClientRect();
    const x = e.clientX ?? (e.touches && e.touches[0].clientX);
    const y = e.clientY ?? (e.touches && e.touches[0].clientY);
    if (x == null || y == null) return;

    const px = x - rect.left;
    const py = y - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // Adjust these multipliers to taste (lower = subtler)
    const maxTilt = 10; // degrees
    const rotateX = ((py - cy) / cy) * -maxTilt;
    const rotateY = ((px - cx) / cx) * maxTilt;

    // Smoothly animate the proxy object to the new target.
    // onUpdate writes values to the element — single tween, overwritten on new events.
    const elRef = frameRef.current;
    if (tweenRef.current) tweenRef.current.kill();

    tweenRef.current = gsap.to(proxyRef.current, {
      rx: rotateX,
      ry: rotateY,
      duration: 0.6, // longer = smoother feel
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => {
        // write out during tween — keeps updates smooth and batched
        gsap.set(elRef, {
          rotateX: proxyRef.current.rx,
          rotateY: proxyRef.current.ry,
          transformPerspective: 700,
        });
      },
    });
  };

  const handlePointerLeave = () => {
    const el = frameRef.current;
    if (!el) return;

    // Return smoothly to neutral
    if (tweenRef.current) tweenRef.current.kill();

    tweenRef.current = gsap.to(proxyRef.current, {
      rx: 0,
      ry: 0,
      duration: 0.8,
      ease: "power4.out",
      overwrite: true,
      onUpdate: () => {
        gsap.set(el, {
          rotateX: proxyRef.current.rx,
          rotateY: proxyRef.current.ry,
        });
      },
    });
  };

  return (
    <div id="story" className="w-screen  text-blue-50">
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <div className="relative size-full">
          <AnimatedTitle
            title="<b>Welcome to our ROW League showcase</b>"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />

          <div className="story-img-container">
            <div className="story-img-mask">
              <div className="story-img-content">
                <img
                  ref={frameRef}
                  // use pointer events (covers mouse + touch)
                  onPointerMove={handlePointerMove}
                  onPointerLeave={handlePointerLeave}
                  onPointerCancel={handlePointerLeave}
                  onPointerUp={handlePointerLeave}
                  src="/img/entrance.webp"
                  alt="entrance"
                  className="object-contain"
                  // inline style as fallback so it's active even before JS runs
                  style={{
                    willChange: "transform",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                />
              </div>
            </div>

            {/* for the rounded corner */}
            <svg
              className="invisible absolute size-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="flt_tag">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="8"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="flt_tag"
                  />
                  <feComposite
                    in="SourceGraphic"
                    in2="flt_tag"
                    operator="atop"
                  />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingImage;
