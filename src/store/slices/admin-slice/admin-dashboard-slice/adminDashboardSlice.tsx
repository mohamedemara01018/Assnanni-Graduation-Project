import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// 1. Fully matched the response metrics from the API payload
export interface AdminDashboardData {
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
    totalRevenue: number;
    todayRevenue: number;
    monthRevenue: number;
}

// 2. Swagger standard envelope wrapper format structure
export interface AdminDashboardApiResponse {
    succeeded: boolean;
    message: string;
    data: AdminDashboardData;
    meta: any;
}

export interface AdminDashboardState {
    data: AdminDashboardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: AdminDashboardState = {
    data: null,
    loading: false,
    error: null,
};

// 3. Async Thunk targeting 'Admin/dashboard'
export const fetchAdminDashboard = createAsyncThunk(
    "adminDashboard/fetchAdminDashboard",
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");
        try {
            const response = await fetch(`${backendUrl}Admin/dashboard`, {
                headers: {
                    Authorization: `Bearer ${cookieToken}`,
                },
            });

            const json: AdminDashboardApiResponse = await response.json();

            if (!response.ok || !json.succeeded) {
                return rejectWithValue(json?.message || "Request failed to fetch dashboard stats");
            }
            
            return json; // Pass along envelope payload
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong parsing operational metrics");
        }
    }
);

// 4. Slice implementation
export const adminDashboardSlice = createSlice({
    name: "adminDashboard",
    initialState,
    reducers: {
        clearAdminDashboardState: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDashboard.fulfilled, (state, action: PayloadAction<AdminDashboardApiResponse>) => {
                state.loading = false;
                state.data = action.payload.data;
            })
            .addCase(fetchAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Error loading summary data";
            });
    },
});

export const { clearAdminDashboardState } = adminDashboardSlice.actions;
export const selectAdminDashboardState = (state: RootState) => state.adminDashboardSlice;

export default adminDashboardSlice.reducer;