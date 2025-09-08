import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const videoRef = useRef(null);

  useGSAP(() => {
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

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      {/* Background Video */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          src="videos/cod.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center"
        />

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
