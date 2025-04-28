import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative ">
      <motion.div
        className="  bg-gradient-to-r from-blue-950 via-slate-900 to-slate-800 text-white py-12 px-6 sm:px-10 md:px-20 rounded-t-3xl shadow-2xl relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 tracking-tight">
            BlogSpire
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Crafting content that resonates. Empowering voices to inspire. ✍️🚀
          </p>

          {/* Social Icons */}
          <div className="flex justify-center items-center gap-4 mt-6">
            {[
              { icon: FaGithub, link: "https://github.com/shivaygit4390" },
              { icon: FaLinkedinIn, link: "https://www.linkedin.com/in/nirmal01/" },
              { icon: FaInstagram, link: "https://www.instagram.com/imperfect___99/" },
            ].map(({ icon: Icon, link }, index) => (
              <motion.a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-10 hover:bg-yellow-400 text-black hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="text-xl" />
              </motion.a>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-6">
            © {new Date().getFullYear()} BlogSpire. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
