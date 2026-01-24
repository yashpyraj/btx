import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoLockClosed, IoArrowBack, IoShieldCheckmark } from "react-icons/io5";
import KvKAdmin from "./KvKAdmin";

const ADMIN_PIN = "2026";

const KvKAdminWrapper = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("kvk_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();

    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("kvk_admin_auth", "true");
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
    sessionStorage.removeItem("kvk_admin_auth");
    navigate("/kvk-stats");
  };

  if (isAuthenticated) {
    return <KvKAdmin onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mb-4">
              <IoLockClosed className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">KvK Admin Access</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">
              Enter the admin PIN to manage KvK data uploads
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="****"
                autoFocus
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm text-center"
              >
                {error}
                {attempts >= 2 && " Redirecting..."}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <IoShieldCheckmark className="w-5 h-5" />
              Authenticate
            </button>
          </form>

          <button
            onClick={() => navigate("/kvk-stats")}
            className="mt-6 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <IoArrowBack className="w-4 h-4" />
            Back to KvK Stats
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default KvKAdminWrapper;
