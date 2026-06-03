import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface AppointmentDoctorDetails {
    doctorId: number;
    name: string;
    imageUrl: string | null;
    specialization: string;
    rating: number;
    experienceYears: number;
    consultationFee: number;
    clinicName: string;
    address: string;
    workingHours: string;
    languages: string[];
}

export interface DoctorBookingDetailsState {
    data: AppointmentDoctorDetails | null;
    loading: boolean;
    error: string | null;
}

const initialState: DoctorBookingDetailsState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchDoctorBookingDetails = createAsyncThunk(
    "doctorBookingDetails/fetch",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        const token = Cookies.get("jwtToken");

        if (!token) {
            return rejectWithValue("Unauthorized: missing token");
        }

        try {
            const response = await fetch(
                `${backendUrl}Patient/doctor-booking-details/${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || "Request failed"
                );
            }

            return json?.data as AppointmentDoctorDetails;
        } catch (err: any) {
            return rejectWithValue(err?.message || "Something went wrong");
        }
    }
);

export const doctorBookingDetailsSlice = createSlice({
    name: "doctorBookingDetails",
    initialState,
    reducers: {
        clearDoctorBookingState: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctorBookingDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorBookingDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDoctorBookingDetails.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) || "Failed to fetch data";
            });
    },
});

export const { clearDoctorBookingState } =
    doctorBookingDetailsSlice.actions;

export const doctorBookingDetailsState = (state: RootState) =>
    state.doctorBookingDetailsSlice;

export default doctorBookingDetailsSlice.reducer;