import React, { useState, useRef, useEffect } from "react";
import { Container, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
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
             🪶BlogSpire
            </Link>
          </div>

          {/* Hamburger */}
          <div className="sm:hidden">
            <button onClick={toggleMenu}>
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden sm:flex items-center gap-6 text-base font-medium">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                key="mobile-nav"
                ref={menuRef}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                className="absolute top-full left-0 w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-b-2xl shadow-lg p-6 flex flex-col gap-6"
              >
                {/* Nav Links */}
                <ul className="flex flex-col items-center gap-6 font-semibold text-lg">
                  {navItems.map(
                    (item) =>
                      item.active && (
                        <motion.li key={item.name} variants={itemVariants}>
                          <button
                            onClick={() => {
                              navigate(item.slug);
                              closeMenu();
                            }}
                            className="px-6 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 w-full text-center"
                          >
                            {item.name}
                          </button>
                        </motion.li>
                      )
                  )}
                  {authStatus && (
                    <motion.li variants={itemVariants}>
                      <LogoutBtn />
                    </motion.li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
