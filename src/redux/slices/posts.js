import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

export const fetchPostsByTag = createAsyncThunk(
  "posts/fetchPostsByTag",
  async (tag) => {
    const { data } = await axios.get("/posts");
    return data.filter((post) => post.tags.includes(tag));
  }
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async () => {
    const { data } = await axios.get("/comments");
    return data;
  }
);

export const fetchRemovePosts = createAsyncThunk(
  "posts/fetchRemovePosts",
  async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading,",
  },
  tags: {
    items: [],
    status: "loading,",
  },
  comments: {
    items: [],
    status: "loading,",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "success";
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    });

    builder.addCase(fetchPostsByTag.pending, (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    });
    builder.addCase(fetchPostsByTag.fulfilled, (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "success";
    });
    builder.addCase(fetchPostsByTag.rejected, (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    });

    builder.addCase(fetchTags.pending, (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "success";
    });
    builder.addCase(fetchTags.rejected, (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    });

    builder.addCase(fetchComments.pending, (state) => {
      state.comments.items = [];
      state.comments.status = "loading";
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = "success";
    });
    builder.addCase(fetchComments.rejected, (state) => {
      state.comments.items = [];
      state.comments.status = "error";
    });
  },
});

export const selectPosts = (state) => state.posts;

export default postsSlice.reducer;
