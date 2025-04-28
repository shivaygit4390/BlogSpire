import React from "react";
import { motion } from "framer-motion";
import { FaFeatherAlt } from "react-icons/fa"; // Feather icon

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Nebula Background Glow */}
      <div className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%] z-0">
        <div className="absolute w-full h-full bg-gradient-to-br from-purple-800 via-blue-500 to-pink-400 blur-3xl opacity-30 animate-pulse" />
        <div className="absolute w-2/3 h-2/3 top-[20%] left-[15%] bg-gradient-radial from-pink-500/40 via-transparent to-transparent rounded-full blur-2xl" />
        <div className="absolute w-1/2 h-1/2 bottom-[10%] right-[10%] bg-gradient-radial from-blue-400/30 via-transparent to-transparent rounded-full blur-2xl" />
      </div>

      {/* Main Loader */}
      <motion.div
        className="relative w-40 h-40 flex items-center justify-center z-10"
        initial={{ scale: 0.95 }}
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        {/* Glowing animated border circle */}
        <motion.div
          className="absolute w-full h-full rounded-full border-[6px] border-blue-400/50 shadow-lg shadow-yellow-300"
          animate={{
            rotate: 360,
            borderColor: [
              "rgba(59,130,246,0.5)",
              "rgba(252,173,46,0.8)",
              "rgba(59,130,246,0.5)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />

        {/* Center floating feather */}
        <motion.div
          className="text-white text-4xl z-10"
          animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <FaFeatherAlt />
        </motion.div>

        {/* Pulse glow */}
        <motion.div
          className="absolute w-24 h-24 bg-gradient-to-br from-blue-400 via-yellow-400 to-blue-500 blur-2xl rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Sparkling Stars */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-70"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle 2s ${Math.random() * 2}s infinite ease-in-out`,
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </motion.div>
  );
};

export default Loader;
