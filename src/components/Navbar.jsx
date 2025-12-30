import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "./Button";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Cav Guide", path: "/cav-guide" },
  { name: "ROW League", path: "/row-league" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <>
      <div
        ref={navContainerRef}
        className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
      >
        <header className="absolute top-1/2 w-full -translate-y-1/2">
          <nav className="flex size-full items-center justify-between p-4">
            {/* Logo and Product button */}
            <div className="flex items-center gap-3 sm:gap-7">
              <Button
                id="product-button"
                title="Join us"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-blue-50 flex items-center justify-center gap-1 text-xs sm:text-sm px-4 py-2"
              />
            </div>

            {/* Navigation Links and Audio Button */}
            <div className="flex h-full items-center">
              <div className="hidden md:block">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    onClick={() => navigate(item.path)}
                    className={clsx(
                      "nav-hover-btn cursor-pointer",
                      location.pathname === item.path && "text-violet-400"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <button
                onClick={toggleAudioIndicator}
                className="ml-4 sm:ml-10 flex items-center space-x-0.5 min-w-[44px] min-h-[44px] justify-center"
                aria-label="Toggle audio"
              >
                <audio
                  ref={audioElementRef}
                  className="hidden"
                  src="/audio/loop.mp3"
                  loop
                />
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx("indicator-line", {
                      active: isIndicatorActive,
                    })}
                    style={{
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </button>

              {/* Mobile hamburger button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-4 md:hidden flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1.5"
                aria-label="Toggle menu"
              >
                <span className={clsx("block h-0.5 w-6 bg-white transition-all", {
                  "rotate-45 translate-y-2": isMobileMenuOpen,
                })}>
                </span>
                <span className={clsx("block h-0.5 w-6 bg-white transition-all", {
                  "opacity-0": isMobileMenuOpen,
                })}>
                </span>
                <span className={clsx("block h-0.5 w-6 bg-white transition-all", {
                  "-rotate-45 -translate-y-2": isMobileMenuOpen,
                })}>
                </span>
              </button>
            </div>
          </nav>
        </header>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 p-6 pt-24 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "text-white text-lg font-medium cursor-pointer transition-colors min-h-[44px] flex items-center px-4 rounded-lg hover:bg-white/10",
                    location.pathname === item.path && "text-violet-400 bg-white/10"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
