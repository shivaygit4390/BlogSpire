import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { setCachedPosts } from "../store/postCacheSlice";
import Loader from "../components/Loader";
import { sortPosts } from "../utils/sortPosts";
import NoPostsFound from "../components/NoPostsFound";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  // checking auth status if its login or not if not we will not show them post this helps keepinf post list updated
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();

  //caching posts from the store
  const cachedPosts = useSelector((state) => state.post.posts);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus) {
      //if store hve data then we wil fetch posts from store
      if (cachedPosts && cachedPosts.length > 0) {
        const sorted = sortPosts(cachedPosts);
        setPosts(sorted);
        setLoading(false);
      } else {
        // Otherwise will fetch from Appwrite and cache it

        appwriteService.getPosts([]).then((posts) => {
          if (posts) {
            const sorted = sortPosts(posts.documents);
            setPosts(sorted);
            dispatch(setCachedPosts({ posts: sorted }));
          }
          setLoading(false);
        });
      }
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [authStatus, cachedPosts, dispatch]);

  // implementing search logic

  const [searchQuery, setSearchQuery] = useState("");
  // filtering posts on the basis of the querry recieved
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.userName?.toLowerCase().includes(query)
    );
  });

  // logic for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // below line will slice the post object in chunks of post peer page(6) for each page
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  if (currentPosts.length === 0 && filteredPosts.length > 0) {
    setCurrentPage(1);
  }

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
  }, [posts]);

  if (loading) return <Loader />;
  return (
    <>
      {authStatus ? (
        <div className="w-full h-fit py-14 bg-gradient-to-br from-slate-100 to-blue-50">
          <Container>
            <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-8 tracking-tight">
              📚 Browse All Blogs
            </h1>

            {posts.length === 0 ? (
              <p className="text-center text-gray-500 text-lg italic">
                No posts published yet. Stay tuned!
              </p>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Search by title, content, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full mb-6 max-w-lg mx-auto block px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
                 {   currentPosts.length > 0? (  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
                  {currentPosts.map((post) => (
                    <div
                      key={post.$id}
                      className="hover:scale-[1.02] transition-transform duration-300"
                    >
                      <PostCard {...post} />
                    </div>
                  ))}
                </div> ) : (<NoPostsFound/>) }
              
              </div>
            )}
          </Container>
          <div className="flex justify-center mt-10 gap-2 flex-wrap">
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
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10 text-md italic">
          Please login to view the posts.
        </p>
      )}
    </>
  );
};

export default AllPosts;
