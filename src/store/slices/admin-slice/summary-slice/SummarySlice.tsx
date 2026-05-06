import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { token } from "../utils";
import Cookies from "js-cookie";

export interface SummaryData {
  [key: string]: any;
}

interface SummaryState {
  data: SummaryData | null;
  loading: boolean;
  error: string | null;
}

const initialState: SummaryState = {
  data: null,
  loading: false,
  error: null,
};
const cookieToken = Cookies.get("jwtToken");
const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl);
// 🔥 THUNK
export const fetchAdminSummary = createAsyncThunk(
  "summary/fetchAdminSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendUrl}Admin/stats/summary`, {
        headers: {
          Authorization: `Bearer ${cookieToken ?? token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Request failed");
      }
      console.log(response);
      const json = await response.json();
      console.log("json", json);
      return json;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
//TODO use axios like this
//export const fetchAdminSummary = createAsyncThunk(
//   "summary/fetchAdminSummary",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${backendUrl}Admin/stats/summary`, {
//         headers: {
//           Authorization: `Bearer ${cookieToken ?? token}`,
//         },
//       });

//       if (!response.data.succeeded) {
//         return rejectWithValue(response.data?.message || "Request failed");
//       }
//       console.log(response);
//       //   const json = await response.json();
//       console.log("response", response);
//       return response;
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   },
// );

// 🔥 SLICE
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
