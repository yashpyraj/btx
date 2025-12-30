import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef, useState, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  useEffect(() => {
    // Delay video loading to improve initial page load
    const timer = setTimeout(() => {
      setShouldPlayVideo(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.set("#video-frame", {
        clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
        borderRadius: "0% 0% 40% 10%",
      });
      gsap.from("#video-frame", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  });

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      {/* Background Video */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          src={shouldPlayVideo ? "videos/cod.mp4" : undefined}
          autoPlay={shouldPlayVideo}
          loop
          muted
          playsInline
          preload="none"
          loading="lazy"
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadedData={() => setIsVideoLoaded(true)}
          style={{
            opacity: isVideoLoaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />

        {/* Loading placeholder */}
        {!isVideoLoaded && shouldPlayVideo && (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-blue-900 to-black flex items-center justify-center">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        )}

        {/* Centered Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 text-center">
          <h2 className="uppercase font-zentry font-black text-base sm:text-lg text-gray-200 mb-2 tracking-widest">
            welcome to
          </h2>

          <h1 className="uppercase font-zentry font-black text-white text-6xl sm:text-8xl md:text-[10rem] lg:text-[14rem] drop-shadow-lg">
            <b>BTX</b>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
