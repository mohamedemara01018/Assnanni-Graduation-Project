import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";

export interface SummaryData {
  totalDoctors: number,
  totalPatients: number,
  totalStudents: number,
  totalReceptionists: number,
  pendingRequests: number,
  totalVerified: number,
  totalRejected: number,
  totalActionedToday: number,
  appointmentsToday: number,
}

export interface SummaryState {
  data: SummaryData | null;
  loading: boolean;
  error: string | null;
}

const initialState: SummaryState = {
  data: null,
  loading: false,
  error: null,
};

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// THUNK
export const fetchAdminSummary = createAsyncThunk(
  "summary/fetchAdminSummary",
  async (_, { rejectWithValue }) => {
    const cookieToken = Cookies.get("jwtToken");
    try {
      const response = await fetch(`${backendUrl}Admin/stats/summary`, {
        headers: {
          Authorization: `Bearer ${cookieToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Request failed");
      }

      const json = await response.json();
      return json;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);


// SLICE
const summarySlice = createSlice({
  name: "summarySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })

      .addCase(fetchAdminSummary.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || "Error";
      });
  },
});

export const selectSummary = (state: RootState) => state.summarySlice;
export default summarySlice.reducer;
