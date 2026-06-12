import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface DashboardStatistics {
    totalUsers: number;
    activeDoctors: number;
    appointmentsToday: number;
    totalScans: number;
}

export interface PatientGrowthData {
    date: string;
    count: number;
}

export interface AppointmentsChartData {
    date: string;
    count: number;
}

export interface TopDoctorData {
    doctorId: number;
    doctorName: string | null;
    totalAppointments: number;
}

export interface RevenueChartData {
    month: string;
    revenue: number;
}

export interface DashboardAnalysisPayload {
    statistics: DashboardStatistics;
    patientGrowth: PatientGrowthData[];
    appointmentsChart: AppointmentsChartData[];
    topDoctors: TopDoctorData[];
    revenueChart: RevenueChartData[];
}

export interface AnalyticsDashboardState {
    data: DashboardAnalysisPayload | null;
    loading: boolean;
    success: boolean;
    error: string | null;
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: AnalyticsDashboardState = {
    data: null,
    loading: false,
    success: false,
    error: null,
};

// ─── Async Thunk (GET) ───────────────────────────────────────────────────────
export const fetchAdminDashboardAnalysis = createAsyncThunk<
    DashboardAnalysisPayload,
    void,
    { rejectValue: string }
>(
    "admin/fetchDashboardAnalysis",
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            // Matches GET /api/Admin/dashboard-analysis
            const response = await fetch(`${backendUrl}Admin/dashboard-analysis`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Accept": "*/*",
                },
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to fetch dashboard analysis data"
                );
            }

            return json.data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const analyticsDashboardSlice = createSlice({
    name: "analyticsDashboard",
    initialState,
    reducers: {
        clearAnalyticsDashboardState: (state) => {
            state.data = null;
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDashboardAnalysis.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchAdminDashboardAnalysis.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
            })
            .addCase(fetchAdminDashboardAnalysis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { clearAnalyticsDashboardState } = analyticsDashboardSlice.actions;

export const selectAnalyticsDashboardState = (state: RootState) => state.analyticsDashboardSlice;

export default analyticsDashboardSlice.reducer;