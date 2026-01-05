import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchDocumentHistory = createAsyncThunk(
  "documentHistory/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/documents/history", {
        withCredentials: true,
      });

      return res.data.documents;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to load document history"
      );
    }
  }
);
const documentHistorySlice = createSlice({
  name: "documentHistory",
  initialState: {
    documents: [],
    loading: false,
    error: null,
  },
  reducers: {
    setDocumentHistory(state, action) {
      state.documents = action.payload;
    },
    addDocuments(state, action) {
      state.documents = [...action.payload, ...state.documents];
    },

    clearHistory(state) {
      state.documents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocumentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocumentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setDocumentHistory,
  addDocuments,
  clearHistory,
} = documentHistorySlice.actions;

export default documentHistorySlice.reducer;