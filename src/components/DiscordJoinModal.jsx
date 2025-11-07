import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaDiscord } from "react-icons/fa";
import { GiSwordman } from "react-icons/gi";

const DiscordJoinModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const discordUrl = "https://discord.gg/mCYbsx5qjw";

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleJoinDiscord = () => {
    window.open(discordUrl, "_blank");
    setStep(2);
  };

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 100, y: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 100, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[95%] max-w-md md:max-w-lg"
          >
            <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-black via-violet-950/20 to-black shadow-2xl shadow-violet-500/20">
              {/* Animated Background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                {/* Floating Particles */}
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute h-1 w-1 rounded-full bg-violet-400"
                    initial={{
                      x: "50vw",
                      y: "50vh",
                      opacity: 0,
                    }}
                    animate={{
                      x: `calc(50vw + ${particle.x}px)`,
                      y: `calc(50vh + ${particle.y}px)`,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: particle.duration,
                      delay: particle.delay,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/5 p-2 text-white/60 transition-all hover:bg-white/10 hover:text-white hover:rotate-90"
              >
                <IoClose size={24} />
              </button>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="text-center"
                    >
                      {/* Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          damping: 10,
                          stiffness: 200,
                          delay: 0.2,
                        }}
                        className="mb-8 flex justify-center"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{
                              rotate: 360,
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                              scale: { duration: 2, repeat: Infinity },
                            }}
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 opacity-20 blur-xl"
                          />
                          <div className="relative rounded-full bg-gradient-to-br from-violet-600 to-blue-600 p-6">
                            <FaDiscord size={64} className="text-white" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Title */}
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4 font-zentry text-4xl md:text-5xl font-bold text-white"
                      >
                        Join the <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Elite</span>
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8 text-lg text-white/70 font-circular-web"
                      >
                        Ready to join the ranks? Click below to join our Discord community.
                      </motion.p>

                      {/* Join Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleJoinDiscord}
                        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-12 py-4 text-lg font-bold text-white shadow-lg shadow-violet-500/50 transition-all hover:shadow-violet-500/80"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600"
                          initial={{ x: "100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative flex items-center gap-3">
                          <FaDiscord size={24} />
                          Join Discord
                        </span>
                      </motion.button>

                      {/* Decorative Elements */}
                      <div className="mt-8 flex justify-center gap-4">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, -10, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          >
                            <GiSwordman className="text-violet-500/30" size={32} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="text-center"
                    >
                      {/* Success Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          damping: 10,
                          stiffness: 200,
                          delay: 0.2,
                        }}
                        className="mb-8 flex justify-center"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-blue-600 blur-xl"
                          />
                          <div className="relative rounded-full bg-gradient-to-br from-green-600 to-blue-600 p-6">
                            <motion.div
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              <svg
                                className="h-16 w-16 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <motion.path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.5, delay: 0.3 }}
                                />
                              </svg>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Title */}
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4 font-zentry text-4xl md:text-5xl font-bold text-white"
                      >
                        Almost <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">There</span>!
                      </motion.h2>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                      >
                        <p className="text-lg text-white/70 font-circular-web">
                          Now that you've joined our Discord:
                        </p>

                        <div className="mx-auto max-w-md space-y-3 text-left">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-start gap-3 rounded-lg bg-white/5 p-4"
                          >
                            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-sm font-bold">
                              1
                            </div>
                            <p className="text-white/80 font-circular-web">
                              Navigate to the <span className="font-bold text-violet-400">#migration</span> channel
                            </p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-start gap-3 rounded-lg bg-white/5 p-4"
                          >
                            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-sm font-bold">
                              2
                            </div>
                            <p className="text-white/80 font-circular-web">
                              Create a ticket to get started with your migration process
                            </p>
                          </motion.div>
                        </div>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="mt-6 text-sm text-white/50 font-circular-web"
                        >
                          Our team will guide you through the rest!
                        </motion.p>
                      </motion.div>

                      {/* Done Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="mt-8 rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-12 py-4 text-lg font-bold text-white shadow-lg shadow-green-500/50 transition-all hover:shadow-green-500/80"
                      >
                        Got it!
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DiscordJoinModal;
