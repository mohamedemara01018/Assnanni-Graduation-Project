import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface AppointmentBookingResponse {
    appointmentId: number;
    doctorName: string;
    patientId: number;
    scheduleSlotId: number;
    appointmentTime: string;
    appointmentStatus: string;
    bookingType: string;
    message: string;
    createdAt: string;
}

export interface AppointmentBookingState {
    data: AppointmentBookingResponse | null;
    loading: boolean;
    error: string | null;
}

interface FilterProps {
    appointmentType: string;
    paymentMethod: string;
    doctorId: string;
    scheduleSlotId: string;
    notes: string;
}

const initialState: AppointmentBookingState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchBookAppointment = createAsyncThunk(
    "bookAppointmentSlice/fetchBookAppointment",
    async (
        {
            appointmentType,
            paymentMethod,
            doctorId,
            scheduleSlotId,
            notes,
        }: FilterProps,
        { rejectWithValue }
    ) => {
        const token = Cookies.get("jwtToken");

        if (!token) {
            return rejectWithValue("Unauthorized: missing token");
        }

        try {
            const response = await fetch(
                `${backendUrl}Patient?appointmentType=${appointmentType}&paymentMethod=${paymentMethod}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        doctorId: Number(doctorId),
                        scheduleSlotId: Number(scheduleSlotId),
                        notes,
                    }),
                }
            );

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || "Request failed"
                );
            }

            return json.data;
        } catch (err: any) {
            return rejectWithValue(
                err?.message || "Something went wrong"
            );
        }
    }
);

export const bookAppointmentSlice = createSlice({
    name: "bookAppointmentSlice",
    initialState,
    reducers: {
        clearBookAppointmentState: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchBookAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to book appointment";
            });
    },
});

export const { clearBookAppointmentState } =
    bookAppointmentSlice.actions;

export const bookAppointmentState = (state: RootState) =>
    state.bookAppointmentSlice;

export default bookAppointmentSlice.reducer;