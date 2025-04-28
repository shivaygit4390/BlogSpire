import React, { useState } from "react";
import { Container, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },

    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Dashboard", slug: "/dashboard", active: authStatus },
  ];

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-800 shadow-lg sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between py-4 text-white relative">
          {/* Logo */}
          <div className="text-3xl font-bold tracking-wide drop-shadow-lg">
            <Link
              to="/"
              className="hover:text-yellow-400 transition duration-300"
            >
              BlogSpire
            </Link>
          </div>

          {/* Hamburger  */}
          <div className="sm:hidden">
            <button onClick={toggleMenu}>
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* Navigation  */}
          <AnimatePresence>
            {(isMobileMenuOpen || window.innerWidth >= 640) && (
              <motion.ul
                key="nav"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                className={`sm:flex flex-col sm:flex-row absolute sm:static top-16 left-0 w-full sm:w-auto bg-slate-900 sm:bg-transparent px-6 sm:px-0 py-4 sm:py-0 gap-3 sm:gap-6 text-sm sm:text-base font-medium transition-all duration-300 ${
                  isMobileMenuOpen ? "block" : "hidden sm:flex"
                }`}
              >
                {navItems.map((item) =>
                  item.active ? (
                    <motion.li key={item.name} variants={itemVariants}>
                      <button
                        onClick={() => {
                          navigate(item.slug);
                          closeMenu();
                        }}
                        className="w-full text-left sm:text-center px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
                      >
                        {item.name}
                      </button>
                    </motion.li>
                  ) : null
                )}
                {authStatus && (
                  <motion.li variants={itemVariants}>
                    <LogoutBtn />
                  </motion.li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
