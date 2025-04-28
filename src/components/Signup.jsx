import { toast } from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Loader from "./Loader";
const Signup = () => {
  const [loadingUser, setLoadingUser] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit, setFocus, reset, formState } = useForm();
  const { isSubmitting } = formState;
  useEffect(() => {
    setFocus("name"); //  Tells RHF to focus this input when mounted
  }, [setFocus]);
  const create = async (data) => {
    setLoadingUser(true);
    setError("");
    try {
      const userData = await authService.createAccount(data);

      if (userData) {
        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          dispatch(login({ userData: currentUser }));
          reset();
          toast.success("Congrats!! Account created successfully!");
          navigate("/");
        }
      }
    } catch (e) {
      setError(e.message);
      reset();
      toast.error("Oops!! Signup failed. Please try again.");
    } finally {
      setLoadingUser(false);
    }
  };
  if (loadingUser) return <Loader />;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md sm:max-w-lg bg-white shadow-xl rounded-2xl px-5 sm:px-8 md:px-10 py-10 border border-slate-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1">
            BlogSpire
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700">
            Create an account
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(create)} className="space-y-4">
          <Input
            label="Name:"
            placeholder="Full name"
            {...register("name", { required: true })}
          />
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

          {/* Enhanced Button */}
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-3 bg-blue-700 text-white rounded-xl font-semibold text-base sm:text-lg shadow-md hover:bg-blue-800 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
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
                Creating...
              </div>
            ) : (
              "🚀 Create Account"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Signup;
