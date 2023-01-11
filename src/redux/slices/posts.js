import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: {
    items: [],
    status: "loading,",
  },
  tags: {
    items: [],
    status: "loading,",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducer: {},
});

export const selectPosts = (state) => state.posts;

export default postsSlice.reducer;
