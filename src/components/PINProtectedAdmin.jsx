import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoLockClosed, IoArrowBack, IoShieldCheckmark } from "react-icons/io5";
import HRAdmin from "./HRAdmin";

const ADMIN_PIN = "2026";

const PINProtectedAdmin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("hr_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();

    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("hr_admin_auth", "true");
      setError("");
      setPin("");
    } else {
      setError("Incorrect PIN. Please try again.");
      setAttempts(prev => prev + 1);
      setPin("");

      if (attempts >= 2) {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("hr_admin_auth");
    navigate("/");
  };

  if (isAuthenticated) {
    return <HRAdmin onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 mb-8"
        >
          <IoArrowBack className="text-xl" />
          <span className="text-sm font-semibold">Back to Home</span>
        </button>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
              <IoLockClosed className="text-4xl" />
            </div>
            <h1 className="text-3xl font-zentry font-black text-white mb-2">
              HR ADMIN
            </h1>
            <p className="text-white/60 text-center">
              Enter PIN to access the admin panel
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-white/60 mb-2 font-semibold">
                Admin PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                maxLength={4}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:border-purple-400 focus:outline-none transition-all text-center text-2xl tracking-widest font-bold"
                placeholder="••••"
                autoFocus
                required
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2 flex items-center gap-2"
                >
                  <IoShieldCheckmark className="text-lg" />
                  {error}
                  {attempts >= 2 && " Redirecting..."}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={pin.length === 0}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <IoShieldCheckmark className="text-xl" />
              Unlock Admin Panel
            </button>
          </form>

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-white/40 text-center">
              This area is restricted to HR team members only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/40">
            Attempts: {attempts}/3
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PINProtectedAdmin;
