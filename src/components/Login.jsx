import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Loader from "./Loader";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, setFocus, reset, formState } = useForm();
  const { isSubmitting } = formState;
  const [error, setError] = useState();
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const login = async (data) => {
    setError("");
    setLoadingUser(true);
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          reset();
          navigate("/");
          toast.success("Logged in successfully!");
        }
      }
    } catch (e) {
      setError(e.message);
      reset();
      toast.error("Invalid credentials or login failed.");
    } finally {
      setLoadingUser(false);
    }
  };
  if (loadingUser) return <Loader />;
  return (
    <section className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10 border border-slate-300">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-blue-800 mb-1">BlogSpire</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-700">
            Sign in to your account
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(login)} className="space-y-4">
          <Input
            label="Email:"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: true,
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Email address must be valid",
              },
            })}
          />
          <Input
            label="Password:"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className=" cursor-pointer w-full py-3 bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-md hover:bg-blue-800 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            {" "}
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-5 h-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Signing in
              </div>
            ) : (
              "🚀 Sign in"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Login;
