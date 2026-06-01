import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;


export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';


export interface Appointment {
    id: number;
    doctorId: number;
    doctorName: string;
    doctorImage: string;
    specialty: string;
    type: AppointmentStatus;
    date: string;
    time: string;
    status: AppointmentStatus;
    mode: any;
}

export interface AppointmentsData {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    appointments: Appointment[];
}

export interface AppointmentsState {
    data: AppointmentsData;
    loading: boolean;
    error: string | null;
}

const initialState: AppointmentsState = {
    data: {
        total: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0,
        appointments: [],
    },
    loading: false,
    error: null,
};

interface AppointmentsFilter {
    search: string,
    BookingType: string;
    AppointmentStatus: string;
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