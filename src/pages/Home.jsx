import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/Loader";
import { setCachedPosts } from "../store/postCacheSlice";
import { sortPosts } from "../utils/sortPosts";
import NoPostsFound from "../components/NoPostsFound";
const Home = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const cachedPosts = useSelector((state) => state.post.posts);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (authStatus) {
      if (cachedPosts && cachedPosts.length > 0) {
        const sorted = sortPosts(cachedPosts);
        setPosts(sorted);
        setLoading(false);
      } else {
        appwriteService.getPosts([]).then((posts) => {
          const sorted = sortPosts(posts.documents);
          setPosts(sorted);
          dispatch(setCachedPosts({ posts: sorted }));
          setLoading(false);
        });
      }
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [authStatus, cachedPosts, dispatch]);
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
  }, [posts]);

  // implementing search feature
  const [searchQuery, setSearchQuery] = useState("");
  // filtering posts on the basis of the querry recieved
  const filteredPosts = posts?.filter((post) => post.status === "active").filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.userName?.toLowerCase().includes(query)
    );
  });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  if (loading) return <Loader />;
  if (authStatus && posts.length === 0) {
    return (
      <section className="w-full py-20 text-center bg-gradient-to-br from-slate-100 to-blue-50 min-h-[70vh]">
        <Container>
          <motion.div
            className="max-w-xl mx-auto bg-white p-10 rounded-xl shadow-md border border-slate-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">
              No posts yet
            </h2>
            <p className="text-slate-500 mt-3 text-sm sm:text-base">
              Be the first to create a blog and inspire others!
            </p>
            <Link
              to="/add-post"
              className="inline-block mt-6 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300"
            >
              Create Your First Post
            </Link>
          </motion.div>
        </Container>
      </section>
    );
  }

  if (!authStatus) {
    return (
      <section className="w-full min-h-screen py-16 text-center  flex flex-col justify-center items-center">
        <Container>
          <motion.div
            className="max-w-xl h-full mx-auto bg-white p-10 rounded-xl shadow-md border border-slate-300"
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
    );
  }

  return (
    <section className="w-full py-12 bg-gradient-to-br from-slate-50 to-slate-100 h-fit">
      <Container>
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold text-[#1c398e] mb-8 text-center sm:text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Active Posts 📰
        </motion.h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, content, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg mx-auto block px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

 {   currentPosts.length > 0? ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
        {currentPosts.map((post, index) => (
          <motion.div
            key={post.$id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <PostCard {...post} />
          </motion.div>
        ))}
      </div>) : (<NoPostsFound/>) }
      </Container>
      <div className="flex items-center justify-center pt-5">
        {Array.from(
          { length: Math.ceil(filteredPosts.length / postsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-full border ${
                currentPage === index + 1
                  ? "bg-blue-700 text-white"
                  : "bg-white text-blue-700 border-blue-700"
              } hover:bg-blue-800 hover:text-white transition`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </section>
  );
};

export default Home;
