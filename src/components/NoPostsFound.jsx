import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NoPostsFound = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center min-h-[60vh] sm:min-h-[70vh] px-4 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">
        🔍 No Posts Found
      </h2>
      <p className="text-slate-500 text-sm sm:text-base">
        Try searching with a different keyword.
      </p>
      <Link
        to="/add-post"
        className="inline-block mt-2 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300"
      >
        Create a New Post
      </Link>
    </motion.div>
  );
};

export default NoPostsFound;
