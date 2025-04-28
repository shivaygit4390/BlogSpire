import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PostCard = ({
  $id,
  title,
  featuredImage,
  status,
  $createdAt,
  userName,
}) => {
  const formattedDate = new Date($createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link to={`/post/${$id}`}>
      <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col h-full"
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <img
          src={appwriteService.getFileView(featuredImage)}
          alt={title}
          className="w-full h-52 object-cover"
        />
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h2 className="text-lg font-semibold text-slate-800 mb-2 hover:text-blue-600 transition">
            {title}
          </h2>

          <span
            className={`inline-block mt-1 px-3 py-1 text-sm font-semibold text-center w-fit rounded-full tracking-wide ${
              status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status === "active" ? "Active" : "Inactive"}
          </span>

          <p className="text-sm text-gray-500 mb-2 italic">
            By {userName || "Unknown Author"}
          </p>
          <p className="text-xs text-gray-500 mb-1">{formattedDate}</p>
          <p className="text-sm text-gray-500 mt-auto">Click to read more →</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default PostCard;
