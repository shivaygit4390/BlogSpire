import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; //  importing the reducer
import postSlice from "./postCacheSlice"; //importing the reducer
const store = configureStore({
  reducer: {
    auth: authReducer, 
    post: postSlice,
  },
});

export default store;
