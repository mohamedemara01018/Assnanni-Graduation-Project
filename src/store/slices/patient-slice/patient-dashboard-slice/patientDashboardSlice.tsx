import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface DashboardStats {
    upcomingAppointments: number;
    prescriptions: number;
    medicalRecords: number;
    labResults: number;
}

export interface UpcomingAppointment {
    id: number;
    doctorName: string;
    startTime: string;
    specialization: string;
    date: string;
    status: string;
}

export interface Doctor {
    id: number;
    name: string;
    specialization: string | null;
    rating: number;
    experienceYears: number;
    imageUrl: string | null;
    status: "Available" | "Busy";
}

// export interface RecentActivity {
//     // أضف الحقول عندما تعرف شكل الـ API
// }

export interface HealthReminder {
    message: string;
    reminderTime: string;
}

export interface DashboardData {
    stats: DashboardStats;
    upcomingAppointments: UpcomingAppointment[];
    availableDoctors: Doctor[];
    recentActivities: any[];
    healthReminder: HealthReminder;
    healthTip: string;
}

export interface DashboardState {
    data: DashboardData;
    loading: boolean;
    error: string | null;
}


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

export const fetchPatientDashboard = createAsyncThunk(
    'patientDashboard/fetchPatientDashboard',
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(
                `${backendUrl}Patient/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                    },
                }
            );

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || "Request failed"
                );
            }

            return json; // This payload matches the structure of initialState.data
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

export const patientDashboardSlice = createSlice({
    name: 'patientDashboard',
    initialState,
    reducers: {
        // You can add synchronous reducers here if needed (e.g., clearDashboardState)
        clearDashboardState: (state) => {
            state.data = initialState.data;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatientDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data;
            })
            .addCase(fetchPatientDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearDashboardState } = patientDashboardSlice.actions;

// state
export const patientDashboardState = (state: RootState) => state.patientDashboardSlice

export default patientDashboardSlice.reducer;