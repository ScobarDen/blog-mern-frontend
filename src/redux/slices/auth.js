import axios from "../../axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAuth = createAsyncThunk(
  "posts/fetchUserData",
  async (params) => {
    const { data } = await axios.post("/auth/login", params);
    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuth.pending, (state) => {
      state.data = null;
      state.status = "loading";
    });
    builder.addCase(fetchAuth.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "success";
    });
    builder.addCase(fetchAuth.rejected, (state) => {
      state.data = null;
      state.status = "error";
    });
  },
});

export const { logout } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuth = (state) => Boolean(state.auth.data);

export default authSlice.reducer;
