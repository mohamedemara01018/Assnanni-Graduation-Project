import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface DashboardStats {
    upcomingAppointments: number;
    prescriptions: number;
    medicalRecords: number;
    labResults: number;
}

export interface UpcomingAppointment {
    id: number;
    doctorId: number;           // ← was missing
    doctorName: string;
    doctorImage: string | null; // ← was missing
    startTime: string;
    specialization: string;
    date: string;
    status: string;
}

export interface AvailableDoctor {
    id: number;
    name: string;
    specialization: string | null;
    rating: number;
    experienceYears: number;
    imageUrl: string | null;
    status: string | null;      // ← was "Available" | "Busy", API returns null
}

export interface RecentActivity {  // ← was commented out / any[]
    title: string;
    createdAt: string;
}

export interface HealthReminder {
    message: string;
    reminderTime: string;
}

export interface DashboardData {
    stats: DashboardStats;
    upcomingAppointments: UpcomingAppointment[];
    availableDoctors: AvailableDoctor[];
    recentActivities: RecentActivity[];
    healthReminder: HealthReminder;
    healthTip: string;
}

export interface DashboardState {
    data: DashboardData;
    loading: boolean;
    error: string | null;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: DashboardState = {
    data: {
        stats: {
            upcomingAppointments: 0,
            prescriptions: 0,
            medicalRecords: 0,
            labResults: 0,
        },
        upcomingAppointments: [],
        availableDoctors: [],
        recentActivities: [],
        healthReminder: {
            message: "",
            reminderTime: "",
        },
        healthTip: "",
    },
    loading: false,
    error: null,
};

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchPatientDashboard = createAsyncThunk<
    DashboardData,
    void,
    { rejectValue: string }
>(
    "patientDashboard/fetchPatientDashboard",
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}Patient/dashboard`, {
                headers: {
                    Authorization: `Bearer ${cookieToken}`,
                },
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || "Request failed"
                );
            }

            return json?.data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

export const patientDashboardSlice = createSlice({
    name: "patientDashboard",
    initialState,
    reducers: {
        clearDashboardState: (state) => {
            state.data = initialState.data;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatientDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchPatientDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Something went wrong";
            });
    },
});

export const { clearDashboardState } = patientDashboardSlice.actions;

export const patientDashboardState = (state: RootState) => state.patientDashboardSlice;

export default patientDashboardSlice.reducer;