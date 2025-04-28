
import React, { useState } from 'react'
import { useDispatch } from "react-redux"
import authService from "../../appwrite/auth"
import { logout } from "../../store/authSlice"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom'
import { clearCachedPosts } from '../../store/postCacheSlice'
import Loader from '../Loader'


const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); //  loading state

  const logoutHandler = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    setLoading(true); //  Start loading

    authService.logout().then(() => {
      dispatch(logout());
      dispatch(clearCachedPosts());
      toast.success("Logged out successfully!");
      navigate("/");
    }).catch((error) => {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
      setLoading(false); 
    });
  };

  if (loading) {
    return <Loader />; // loader while logging out
  }

  return (
    <motion.button
      whileHover={{ scale: .8 }}
      whileTap={{ scale: 0.7 }}
      onClick={logoutHandler}
      className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 font-semibold"
    >
      Logout
    </motion.button>
  )
}

export default LogoutBtn;
