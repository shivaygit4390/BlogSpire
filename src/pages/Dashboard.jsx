import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "../appwrite/auth";
import { logout } from "../store/authSlice";
import { toast } from "react-hot-toast";
import { Container } from "../components";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { setCachedPosts } from "../store/postCacheSlice";
import appwriteService from "../appwrite/config";
import { sortPosts } from "../utils/sortPosts";
const Dashboard = () => {
  const userData = useSelector((state) => state.auth.userData);

  const cachedPosts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  useEffect(() => {
    const fetchPostsIfNeeded = async () => {
      if (cachedPosts == null || cachedPosts.length == 0 || !cachedPosts) {
        try {
          setLoadingPosts(true);
          const postsResponse = await appwriteService.getPosts();
          if (postsResponse && postsResponse.documents) {
            const sortedPosts = sortPosts(postsResponse.documents);
            dispatch(setCachedPosts({ posts: sortedPosts }));
          }
        } catch (error) {
        } finally {
          setLoadingPosts(false);
        }
      }
    };

    fetchPostsIfNeeded();
  }, [cachedPosts, dispatch]);
  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await authService.deleteAccount();
      dispatch(logout());
      toast.success("Please contact Admin to delete your Account");
      navigate("/signup");
    } catch (error) {
      toast.error(
        "Appwrite doesn't provide account deletion from client side, Please Contact the Admin"
      );
    } finally {
      setDeletingAccount(false);
    }
  };
  // Format the account creation date
  const formattedDate = userData?.$createdAt
    ? format(new Date(userData.$createdAt), "dd MMM yyyy, hh:mm a")
    : "Unknown";

  // Get user's posts from cache
  const userPosts =
    cachedPosts?.filter((post) => post.userId === userData?.$id) || [];

  // Latest post logic
  const latestPost = userPosts.length
    ? [...userPosts].sort(
        (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
      )[0]
    : null;

  const lastActivity = latestPost
    ? format(new Date(latestPost.$createdAt), "dd MMM yyyy, hh:mm a")
    : null;

  // Post stats
  const totalPosts = userPosts.length;
  const activePosts = userPosts.filter((p) => p.status === "active").length;
  const inactivePosts = userPosts.filter((p) => p.status === "inactive").length;

  // My Posts tab filter
  const [selectedTab, setSelectedTab] = useState("All");
  const filteredPosts = userPosts.filter((post) => {
    if (selectedTab === "Active") return post.status === "active";
    if (selectedTab === "Inactive") return post.status === "inactive";
    return true; // All
  });

  
  if (!userData || loadingPosts) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <Container>
      <div className="py-12 space-y-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 tracking-tight">
          Welcome to your Dashboard,{" "}
          <span className="text-blue-600">{userData?.name}</span>
        </h1>

        {/* Account Info */}
        <section className="rounded-2xl border border-slate-200 shadow-xl p-6 bg-gradient-to-br from-white via-slate-50 to-white">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4 border-b pb-2 border-slate-200">
            👤 Account Information
          </h2>
          <p className="text-slate-700 text-lg mb-2">
            <span className="font-medium">Name:</span> {userData?.name}
          </p>
          <p className="text-slate-700 text-lg">
            <span className="font-medium">Account Created On:</span>{" "}
            {formattedDate}
          </p>
        </section>

        {/* Last Activity */}
        <section className="rounded-2xl border border-yellow-300 shadow-xl p-6 bg-yellow-50">
          <h2 className="text-2xl font-semibold text-yellow-800 mb-4 border-b pb-2 border-yellow-300">
            🕓 Last Activity
          </h2>
          {lastActivity ? (
            <p className="text-yellow-900 text-lg">
              You last published on{" "}
              <span className="font-semibold">{lastActivity}</span>
            </p>
          ) : (
            <p className="italic text-yellow-600 text-md">
              No posts yet. Start writing your first blog! 🚀
            </p>
          )}
        </section>

        {/* Blog Stats */}
        <section className="rounded-2xl border border-blue-300 shadow-xl p-6 bg-gradient-to-br from-blue-50 to-white">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6 border-b pb-2 border-blue-200">
            📊 Your Blog Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-white border border-blue-100 rounded-lg shadow-md hover:shadow-lg transition">
              <p className="text-lg font-semibold text-blue-700">Total Posts</p>
              <p className="text-3xl font-bold text-blue-900">{totalPosts}</p>
            </div>
            <div className="p-4 bg-white border border-green-100 rounded-lg shadow-md hover:shadow-lg transition">
              <p className="text-lg font-semibold text-green-700">Active</p>
              <p className="text-3xl font-bold text-green-900">{activePosts}</p>
            </div>
            <div className="p-4 bg-white border border-red-100 rounded-lg shadow-md hover:shadow-lg transition">
              <p className="text-lg font-semibold text-red-700">Inactive</p>
              <p className="text-3xl font-bold text-red-900">{inactivePosts}</p>
            </div>
          </div>
        </section>

        {/* Posts Tab */}
        <section className="rounded-2xl border border-purple-300 shadow-xl p-6 bg-gradient-to-tr from-purple-50 to-white">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4 border-b pb-2 border-purple-200">
            📝 My Posts
          </h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            {["All", "Active", "Inactive"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  selectedTab === tab
                    ? "bg-purple-700 text-white shadow"
                    : "bg-white border-purple-300 text-purple-700 hover:bg-purple-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.$id}
                  className="p-5 border border-slate-200 rounded-xl bg-white shadow-md hover:shadow-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-lg font-semibold text-slate-800">
                        {post.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        Status:{" "}
                        <span className="capitalize">{post.status}</span>
                      </p>
                    </div>
                    <Link
                      to={`/post/${post.$id}`}
                      className="inline-block px-4 py-2 mt-2 sm:mt-0 rounded-md border border-blue-600 text-blue-700 font-medium text-sm hover:bg-blue-600 hover:text-white transition-all duration-200"
                    >
                      Go to Post
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="italic text-slate-500">
                No posts in this category.
              </p>
            )}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-2xl border border-red-300 shadow-xl p-6 bg-gradient-to-br from-white to-red-50">
          <h2 className="text-2xl font-semibold text-red-700 mb-4 border-b pb-2 border-red-200">
            ⚠️ Danger Zone
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Delete My Account
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-sm font-medium text-red-700">
                Are you absolutely sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-1.5 rounded-md bg-red-700 text-white font-semibold hover:bg-red-800 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-1.5 rounded-md bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
};

export default Dashboard;
