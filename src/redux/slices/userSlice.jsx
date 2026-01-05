import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const Backend_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`/api/auth/me`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch user");
    }
  }
);

const initialState = {
  id: null,
  username: null,
  avatar: null,
  email: null,
  new_user: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.avatar = action.payload.avatar;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.new_user = action.payload.new_user;
    },
    clearUser: (state) => {
      state.id = null;
      state.username = null;
      state.avatar = null;
      state.email = null;
      state.new_user = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.avatar = action.payload.avatar;
        state.email = action.payload.email;
        state.username = action.payload.username;
        state.new_user = action.payload.new_user;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;