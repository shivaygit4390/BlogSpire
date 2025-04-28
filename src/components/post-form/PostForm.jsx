// multiputpose comp will be used for edit add both
import { useForm } from "react-hook-form";
import React, { useCallback, useEffect } from "react";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCachedPosts } from "../../store/postCacheSlice";
import toast from "react-hot-toast";
import Loader from "../Loader";

// below if user is using this form to edit he will pass the details of the post as post in the postform comp if he is using it for adding a post he wouldnt pass thr vslues ie all fields will be empty

const PostForm = ({ post }) => {
  // now giving the values or setting upn the form as per usage--empty if using to add post and existing data fethed if using to edit post
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    setFocus,
    formState,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });
  const { isSubmitting } = formState;
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const cachedPosts = useSelector((state) => state.post.posts);
  // now setting up submit logic for update and create
  const submit = async (data) => {
    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;
      if (file) {
        // delete the old image after above new upload img
        appwriteService.deleteFile(post.featuredImage);
      }
      // now updating the post in db
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });

      if (dbPost) {
        dispatch(
          setCachedPosts({
            posts: cachedPosts.map((p) => (p.$id === dbPost.$id ? dbPost : p)),
          })
        );
        toast.success(" Post updated successfully!");
        navigate(`/post/${dbPost.$id}`);
      }
    }
    // when to create post and no post is passed
    else {
      if (!data.image || data.image.length === 0 ) {
        toast.error(" Image is required to create a blog post!");
        return; // Stop further execution
      }
      const file = await appwriteService.uploadFile(data.image[0]);
      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
          userName: userData.name,
        });

        if (dbPost) {
          dispatch(setCachedPosts({ posts: [dbPost, ...cachedPosts] }));
          toast.success("🎉 Post created successfully!");
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);
  useEffect(() => {
    setFocus("title");
  });
  if (isSubmitting) return <Loader />;
  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col md:flex-row gap-8"
    >
      {/* Left Section: Title, Slug, Content */}
      <div className="w-full md:w-2/3 space-y-6">
        <Input
          label="Title"
          placeholder="Enter your blog title"
          className="w-full"
          {...register("title", { required: true })}
        />

        <Input
          label="Slug"
          placeholder="Auto-generated from title"
          className="w-full"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />

        <div>
          <label className="block text-slate-700 font-medium mb-1">
            Content
          </label>
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <RTE
              name="content"
              control={control}
              defaultValue={getValues("content")}
            />
          </div>
        </div>
      </div>

      {/* Right Section: Image, Status, Submit */}
      <div className="w-full md:w-1/3 space-y-6">
        <Input
          label="Featured Image"
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          className="w-full"
          {...register("image", { required: !post })}
        />

        {post && (
          <div className="w-full">
            <img
              src={appwriteService.getFileView(post.featuredImage)}
              alt={post.title}
              className="rounded-xl border border-slate-300 shadow-sm"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Post Status"
          className="w-full"
          {...register("status", { required: true })}
        />

        <Button
          disabled={isSubmitting}
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex justify-center items-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              {post ? "Updating..." : "Submitting..."}
            </div>
          ) : post ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
