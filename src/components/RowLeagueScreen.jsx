import { useState, useEffect, useRef } from "react";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { GiCrown } from "react-icons/gi";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lenis from "lenis";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import { CardCarousel } from "./CardCarousel";
import DiscordJoinModal from "./DiscordJoinModal";

const RowLeagueScreen = () => {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerRef = useRef(null);

  // Initialize smooth scrolling
  useEffect(() => {
    // Delay video loading for better performance
    const videoTimer = setTimeout(() => {
      setShouldPlayVideo(true);
    }, 500);

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      clearTimeout(videoTimer);
      lenis.destroy();
    };
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Shiso",
      role: "Elite Warrior",
      image: "/img/shiso.png",
      stats: {
        wins: 127,
        kdr: "3.2",
        rank: "Grandmaster",
      },
      description:
        "Strategic mastermind leading the charge with unmatched tactical prowess.",
    },
    {
      id: 2,
      name: "Esvipe",
      role: "Elite Warrior",
      image: "/img/esvipe.png",
      stats: {
        wins: 98,
        kdr: "4.1",
        rank: "Master",
      },
      description:
        "Elite warrior specializing in high-impact combat scenarios and battlefield control.",
    },
    {
      id: 3,
      name: "FOB",
      role: "Strategy Coordinator",
      image: "/img/fob.png",
      stats: {
        wins: 89,
        kdr: "2.8",
        rank: "Master",
      },
      description:
        "Tactical genius coordinating team movements and strategic positioning.",
    },
    {
      id: 4,
      name: "Joker",
      role: "Support Specialist",
      image: "/img/joker.png",
      stats: {
        wins: 76,
        kdr: "2.5",
        rank: "Diamond",
      },
      description:
        "Versatile support player ensuring team cohesion and battlefield awareness.",
    },
    {
      id: 5,
      name: "Ikka",
      role: "Team Captain",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
      stats: {
        wins: 82,
        kdr: "3.0",
        rank: "Master",
      },
      description:
        "Fierce combatant with exceptional battlefield instincts and tactical execution.",
      isLeader: true,
    },
  ];

  // Additional team members for carousel
  const allTeamImages = Array.from({ length: 29 }, (_, i) => ({
    src: `/img/row/row${i + 1}.png`,
    alt: `Row Player ${i + 1}`, // You can later map real names/roles if needed
  }));


  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#dfdff0] text-black font-general overflow-x-hidden"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <IoArrowBack className="text-xl" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-3xl font-zentry font-black text-white tracking-wider">
              ROW LEAGUE
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-300 via-blue-300 to-yellow-300">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay={shouldPlayVideo}
            loop
            muted
            playsInline
            preload="none"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onLoadedData={() => setIsVideoLoaded(true)}
            style={{
              opacity: isVideoLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            {shouldPlayVideo && (
              <source src="/videos/race.mp4" type="video/mp4" />
            )}
          </video>

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

          {/* Video overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-4">
          <AnimatedTitle
            title="<b>Welcome</b> to our <br /> ROW League <b>showcase</b>"
            containerClass="!text-white mb-8 drop-shadow-2xl"
          />
        </div>
      </section>

      {/* Team Members Section with Scroll Effects */}
      <section className="py-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <AnimatedTitle
            title="Meet the <b>leads</b>"
            containerClass="mb-8 !text-black text-center"
          />

          <p className="text-center text-black/60 text-lg mb-16 font-general">
            Will be announced soon
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="group relative bg-black rounded-3xl overflow-hidden cursor-pointer transform-gpu will-change-transform"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: "easeOut",
                  },
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {member.isLeader && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-zentry font-black">
                    <GiCrown className="text-sm" />
                    CAPTAIN
                  </div>
                )}

                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/img/placeholder.webp";
                    }}
                  />
                </div>

                <div className="p-6 text-white">
                  <h3 className="text-2xl font-zentry font-black mb-2">
                    {member.name}
                  </h3>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Carousel Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedTitle
            title="<b>team</b>"
            containerClass="mb-16 !text-black text-center"
          />

          <CardCarousel
            images={allTeamImages}
            autoplayDelay={2000}
            showPagination={true}
            showNavigation={true}
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <AnimatedTitle
            title="Think you have <b>what it takes</b>?"
            containerClass="mb-12 !text-white"
          />

          <div className="flex flex-wrap justify-center gap-6">
            <div onClick={() => setIsModalOpen(true)}>
              <Button
                title="Join us"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-violet-500 hover:bg-violet-600 text-white"
              />
            </div>
          </div>
        </div>
      </section>

      <DiscordJoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default RowLeagueScreen;
