import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

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

// 🔥 THUNK
export const fetchAdminSummary = createAsyncThunk(
    "summary/fetchAdminSummary",
    async (_, { rejectWithValue }) => {
        try {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NjE2OTAwOS05MzE5LTQ5ZTgtYjAwOC02YjQ0ZmIwZTY5NzciLCJlbWFpbCI6Im1hcmhqbWFsNkBnbWFpbC5jb20iLCJ1bmlxdWVfbmFtZSI6Im1hcmhqbWFsNkBnbWFpbC5jb20iLCJqdGkiOiI5ZWQzNzUzZi1iMmMzLTQ2Y2EtYWU2OC1kN2Q1MTUxMTUwM2EiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjU2MTY5MDA5LTkzMTktNDllOC1iMDA4LTZiNDRmYjBlNjk3NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJtYXJoam1hbDZAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbIkFkbWluIiwiRG9jdG9yIl0sImV4cCI6MTc3ODAwNjI0NiwiaXNzIjoiTXlBcHAuQXBpIiwiYXVkIjoiTXlBcHAuQ2xpZW50In0.Dk3gWYcM2sPZjotFV2qqqWBaY4TXWIXWwWNVcdx7gSU'

            const response = await fetch(
                "https://asnani.runasp.net/api/Admin/stats/summary",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.message || "Request failed");
            }

            const json = await response.json();
            console.log('json', json)
            return json;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

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