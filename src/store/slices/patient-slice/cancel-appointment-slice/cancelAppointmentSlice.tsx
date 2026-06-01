import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface RescheduleAppointmentState {
    data: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: RescheduleAppointmentState = {
    data: null,
    loading: false,
    error: null,
};

interface FilterProps {
    appointmentId: string;
    reason: string;
}

export const fetchCancelAppointment = createAsyncThunk(
    "cancelAppointmentSlice/fetchCancelAppointment",
    async (
        { appointmentId, reason }: FilterProps,
        { rejectWithValue }
    ) => {
        const token = Cookies.get("jwtToken");

        if (!token) {
            return rejectWithValue("Unauthorized: missing token");
        }

        try {
            const response = await fetch(
                `${backendUrl}Patient/cancel-my-appointment`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        appointmentId: Number(appointmentId),
                        reason,
                    }),
                }
            );

            // Read the raw text first — JSON parsing may fail on empty
            // or plain-text responses (e.g. 200 OK with no body, 204, etc.)
            const text = await response.text();
            const json = text ? JSON.parse(text) : null;
            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || `Request failed (${response.status})`
                );
            }

            return json?.data ?? json ?? true;
        } catch (err: any) {
            return rejectWithValue(err?.message || "Network error");
        }
    }
);

export const cancelAppointmentSlice = createSlice({
    name: "cancelAppointmentSlice",
    initialState,
    reducers: {
        clearCancelState: (state) => {
            state.loading = false;
            state.error = null;
            state.data = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCancelAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = null;
            })
            .addCase(fetchCancelAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCancelAppointment.rejected, (state, action) => {

                state.loading = false;
                state.error =
                    (action.payload as string) || "Failed to reschedule appointment";
            });
    },
});

export const { clearCancelState } = cancelAppointmentSlice.actions

export const cancelAppointmentState = (state: RootState) =>
    state.cancelAppointmentSlice;

export default cancelAppointmentSlice.reducer;