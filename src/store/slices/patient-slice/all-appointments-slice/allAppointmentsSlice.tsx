import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;


export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Missed';
export type AppointmentMode = 'Online' | 'InClinic';
export type AppointmentType = 'FollowUp' | 'Checkup' | 'Consultation' | 'Emergency';

export interface Appointment {
    id: number;
    doctorId: number;
    doctorName: string;
    doctorImage: string;
    specialty: string;
    type: AppointmentType;       // Fixed typo from AppointmentStatus
    date: string;                // e.g., "2026-06-10"
    time: string;                // e.g., "09:30:00"
    status: AppointmentStatus;
    mode: AppointmentMode;       // Replaced 'any' with a strict union type
    isFeedbackGiven: boolean;    // Added missing property from your JSON
}

// New interface matching your paginated server data object
export interface PaginatedAppointments {
    items: Appointment[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageNumber: number | null;
    previousPageNumber: number | null;
}

export interface AppointmentsData {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    missedAppointments: number;
    appointments: PaginatedAppointments; // Updated from Appointment[] to match the structure
}

export interface AppointmentsState {
    data: AppointmentsData;
    loading: boolean;
    error: string | null;
}

// Example updated initialState matching these new interfaces
const initialState: AppointmentsState = {
    data: {
        total: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0,
        missedAppointments: 0,
        appointments: {
            items: [],
            pageNumber: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            nextPageNumber: null,
            previousPageNumber: null,
        },
    },
    loading: false,
    error: null,
};

interface AppointmentsFilter {
    search: string,
    BookingType: string;
    AppointmentStatus: string;
    PageNumber: number;
    PageSize: number;
}

export const fetchAllAppointments = createAsyncThunk(
    'allAppointmentSlice/fetchAllAppointments',
    async (filters: AppointmentsFilter, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });
        try {
            const response = await fetch(
                `${backendUrl}Patient/my-appointments-dashboard?${queryParams.toString()}`,
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

export const allAppointmentsSlice = createSlice({
    name: 'allAppointmentsSlice',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data;
            })
            .addCase(fetchAllAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});


// state
export const allAppointmentsState = (state: RootState) => state.allAppointmentsSlice

export default allAppointmentsSlice.reducer;