import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchDocumentHistory = createAsyncThunk(
  "documentHistory/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/documents/history/", {
        params,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to load documents"
      );
    }
  }
);

const documentHistorySlice = createSlice({
  name: "documentHistory",
  initialState: {
    documents: [],
    count: 0,
    page_size: 5,
    total_pages: 0,
    page: 1,
    loading: false,
    error: null,
    selectedIds: [],
  },
  reducers: {
    toggleSelect(state, action) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((x) => x !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    selectAll(state) {
      state.selectedIds = state.documents.map((doc) => doc.id);
    },
    clearSelection(state) {
      state.selectedIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocumentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.results;
        state.count = action.payload.count;
        state.total_pages = action.payload.total_pages;
        state.page_size = action.payload.page_size;
        state.page = action.payload.current_page;
        state.error = null;
      })
      .addCase(fetchDocumentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleSelect, clearSelection, selectAll } =
  documentHistorySlice.actions;

export default documentHistorySlice.reducer;
