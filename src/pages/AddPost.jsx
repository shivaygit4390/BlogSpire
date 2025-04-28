import React from "react";
import { Container, PostForm } from "../components";

function AddPost() {
  return (
    <section className="min-h-screen py-12 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
      <Container>
        <div className="w-full max-w-screen-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-300 px-4 sm:px-6 md:px-10 py-8 md:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 mb-8 leading-tight text-center sm:text-left flex items-center gap-2">
            📝 Create a New Blog Post
          </h1>

          {/* Post Form */}
          <PostForm />
        </div>
      </Container>
    </section>
  );
}

export default AddPost;
