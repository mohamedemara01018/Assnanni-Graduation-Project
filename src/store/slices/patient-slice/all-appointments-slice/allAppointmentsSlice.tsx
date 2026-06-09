import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'Missed';
export type AppointmentMode = 'Online' | 'InClinic';
export type AppointmentType = 'FollowUp' | 'Checkup' | 'Consultation' | 'Emergency';

export interface Appointment {
    id: number;
    doctorId: number;
    doctorName: string;
    doctorImage: string;
    specialty: string;
    type: AppointmentType;       
    date: string;                
    time: string;                
    status: AppointmentStatus;
    mode: AppointmentMode;       
    isFeedbackGiven: boolean;    
}

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
    appointments: PaginatedAppointments; 
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
    search: string;
    BookingType: string;
    AppointmentStatus: string;
    PageNumber: number;
    PageSize: number;
}

// Helper to normalize backend payload data safely matching PaginatedAppointments schema
const normalizeAppointmentsData = (payload: any): AppointmentsData => {
    const raw = payload?.data ?? payload ?? {};
    
    return {
        total: Number(raw.total ?? 0),
        upcoming: Number(raw.upcoming ?? 0),
        completed: Number(raw.completed ?? 0),
        cancelled: Number(raw.cancelled ?? 0),
        missedAppointments: Number(raw.missedAppointments ?? 0),
        appointments: {
            items: Array.isArray(raw.appointments?.items) ? raw.appointments.items : [],
            pageNumber: Number(raw.appointments?.pageNumber ?? 1),
            pageSize: Number(raw.appointments?.pageSize ?? 10),
            totalCount: Number(raw.appointments?.totalCount ?? 0),
            totalPages: Number(raw.appointments?.totalPages ?? 1),
            hasNextPage: Boolean(raw.appointments?.hasNextPage ?? false),
            hasPreviousPage: Boolean(raw.appointments?.hasPreviousPage ?? false),
            nextPageNumber: raw.appointments?.nextPageNumber ?? null,
            previousPageNumber: raw.appointments?.previousPageNumber ?? null,
        }
    };
};

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

            if (!response.ok || !json.succeeded) {
                return rejectWithValue(
                    json?.message || json?.error || "Request failed"
                );
            }

            return json; 
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

export const allAppointmentsSlice = createSlice({
    name: 'allAppointmentsSlice',
    initialState,
    reducers: {
        clearAppointmentsState: (state) => {
            state.data = initialState.data;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.data = normalizeAppointmentsData(action.payload);
            })
            .addCase(fetchAllAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearAppointmentsState } = allAppointmentsSlice.actions;
export const allAppointmentsState = (state: RootState) => state.allAppointmentsSlice;

export default allAppointmentsSlice.reducer;