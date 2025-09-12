import { useState, useEffect, useRef } from "react";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { GiCrown, GiSwordman, GiShield, GiTrophy } from "react-icons/gi";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import { CardCarousel } from "./CardCarousel";

const RowLeagueScreen = () => {
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Initialize smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Shiso",
      role: "Team Captain",
      image: "/img/shiso.png",
      stats: {
        wins: 127,
        kdr: "3.2",
        rank: "Grandmaster",
      },
      description:
        "Strategic mastermind leading the charge with unmatched tactical prowess.",
      isLeader: true,
    },
    {
      id: 2,
      name: "Esvipe",
      role: "Combat Specialist",
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
  ];

  // Additional team members for carousel
  const allTeamImages = [
    { src: "/img/shiso.png", alt: "Shiso - Team Captain" },
    { src: "/img/esvipe.png", alt: "Esvipe - Combat Specialist" },
    { src: "/img/fob.png", alt: "FOB - Strategy Coordinator" },
    { src: "/img/joker.png", alt: "Joker - Support Specialist" },
    { src: "/img/emry.png", alt: "Emry - Reserve Player" },
    { src: "/img/niya.png", alt: "Niya - Scout" },
    { src: "/img/lil.png", alt: "Lil - Analyst" },
    { src: "/img/tournament.png", alt: "Tournament Highlights" },
  ];

  // Scroll-based transforms for the leader card
  const leaderScale = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7],
    [1, 1.1, 1]
  );
  const leaderY = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, -20, 0]);
  const leaderRotate = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7],
    [0, 2, 0]
  );

  // Scroll-based transforms for other cards
  const cardScale = useTransform(scrollYProgress, [0.4, 0.6], [0.95, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0.7, 1]);

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
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 text-center px-4">
          <AnimatedTitle
            title="<b>Welcome</b> to our <br /> ROW League <b>showcase</b>"
            containerClass="!text-black mb-8"
          />
        </div>
      </section>

      {/* Team Members Section with Scroll Effects */}
      <section className="py-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <AnimatedTitle
            title="Meet the <b>Champions</b>"
            containerClass="mb-16 !text-black text-center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => {
              const isLeader = member.isLeader;

              return (
                <motion.div
                  key={member.id}
                  className="group relative bg-black rounded-3xl overflow-hidden cursor-pointer"
                  style={
                    isLeader
                      ? {
                          scale: leaderScale,
                          y: leaderY,
                          rotate: leaderRotate,
                        }
                      : {
                          scale: cardScale,
                          opacity: cardOpacity,
                        }
                  }
                  whileHover={{
                    scale: isLeader ? 1.15 : 1.05,
                    transition: { duration: 0.3 },
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      delay: index * 0.1,
                    },
                  }}
                  viewport={{ once: true }}
                >
                  {member.isLeader && (
                    <motion.div
                      className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-zentry font-black"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <GiCrown className="text-sm" />
                      CAPTAIN
                    </motion.div>
                  )}

                  <div className="aspect-[3/4] overflow-hidden">
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Carousel Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedTitle
            title="Extended <b>Roster</b>"
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
            title="Ready to <b>join</b> the <br /> <b>battle</b>?"
            containerClass="mb-8 !text-white"
          />

          <p className="text-xl font-circular-web text-white/80 mb-12 max-w-2xl mx-auto">
            Think you have what it takes to compete with the best? Join our
            ranks and prove your worth in the arena.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Button
              title="Join Tournament"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-violet-500 hover:bg-violet-600 text-white"
            />
            <Button
              title="View Leaderboard"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-transparent border border-white/30 hover:bg-white/10 text-white"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default RowLeagueScreen;
