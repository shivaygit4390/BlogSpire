// this slice we are creting to store oue posts when the page loads so that fetching shouldnt needed to be done fter each action this way we can implement caching

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [], // postes will be cached in this array
  lastFetched: null, // Timestamp of last fetch (to add session based caching)
};

const postCacheSlice = createSlice({
  name: "postCache",
  initialState,
  reducers: {
    setCachedPosts: (state, action) => {
      state.posts = action.payload.posts;
      state.lastFetched = Date.now();
    },
    clearCachedPosts: (state) => {
      state.posts = [];
      state.lastFetched = null;
    },
  },
});

export const { setCachedPosts, clearCachedPosts } = postCacheSlice.actions;
export default postCacheSlice.reducer;
