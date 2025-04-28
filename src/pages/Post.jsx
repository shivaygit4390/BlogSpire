import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { setCachedPosts } from "../store/postCacheSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
const Post = () => {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;
  const authStatus = useSelector((state) => state.auth.status);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const cachedPosts = useSelector((state) => state.post.posts);

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          setLoading(false);
        } else {
          navigate("/");
          setLoading(false);
        }
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    const confirmDelete = window.confirm(
      "🗑️ Are you sure you want to delete this post?"
    );

    if (confirmDelete) {
      appwriteService.deletePost(post.$id).then((status) => {
        if (status) {
          appwriteService.deleteFile(post.featuredImage);
          dispatch(
            setCachedPosts({
              posts: cachedPosts.filter((p) => p.$id !== post.$id),
            })
          );

          navigate("/");
          toast.success("Post deleted successfully!");
        } else {
          toast.error("Failed to delete the post.");
        }
      });
    }
  };

  if (!post) return <Loader />;
  return post && authStatus ? (
    <div className="py-10 px-4 sm:px-[8vw] md:px-[12vw]">
      <Container>
        {/* Image with edit buttons */}
        <div className="relative mb-6">
          <img
            src={appwriteService.getFileView(post.featuredImage)}
            alt={post.title}
            className="w-full rounded-lg shadow-md"
          />

          {isAuthor && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-600">Edit</Button>
              </Link>
              <Button bgColor="bg-red-600" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Title and content */}
        <div className="text-left space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          <span
            className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full tracking-wide ${
              post.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {post.status === "active" ? "Active" : "Inactive"}
          </span>
          <div className="prose max-w-none prose-sm sm:prose-base">
            {parse(post.content)}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2 italic">
          By {post.userName || "Unknown Author"}
        </p>
      </Container>
    </div>
  ) : (
    <>
      <section className="w-full py-16 text-center bg-gradient-to-br from-slate-100 to-slate-200 min-h-[70vh]">
        <Container>
          <motion.div
            className="max-w-xl mx-auto bg-white p-10 rounded-xl shadow-md border border-slate-300"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Login to Read Posts
            </h1>
            <p className="text-slate-500 mt-3 text-sm sm:text-base">
              Sign in to access our awesome blog content and explore insights!
            </p>
            <Link
              to="/login"
              className="inline-block mt-6 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300"
            >
              Login Now
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default Post;
