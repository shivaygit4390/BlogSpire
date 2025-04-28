import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../src/appwrite/auth";
import { login, logout } from "../src/store/authSlice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop ";

function App() {
  // here we need to check if user is logged in or not when app loads and output will be acording to that
  // creating loading coz we are communicating with backend may take some time
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      {" "}
      {!loading ? (
        <div className="flex flex-col min-h-screen">
          {" "}
          <ScrollToTop /> <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      ) : null}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
