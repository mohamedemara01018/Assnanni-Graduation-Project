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

export interface Doctor {
    id: number;
    name: string;
    specialization: string | null;
    rating: number;
    experienceYears: number;
    imageUrl: string | null;
    status: 'Available' | 'Busy';
}

// Interface for your slice's initial state
export interface DashboardState {
    data: {
        stats: DashboardStats;
        upcomingAppointments: any[];
        availableDoctors: Doctor[];
        recentActivities: any[];
    };
    loading: boolean;          // Track loading state
    error: string | null;       // Track error state
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