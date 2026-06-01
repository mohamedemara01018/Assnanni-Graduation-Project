import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface DoctorInfo {
    id: number;
    name: string;
    specialization: string;
    imageUrl: string | null;
    rating: number;
    experienceYears: number;
    governments: string | null;
}

export interface ClinicInfo {
    clinicName: string;
    clinicLocation: string;
    clinicEmail: string;
    clinicWebsite: string;
    clinicHours: string;
    clinicPhoneNumber: string;
}


export interface AppointmentDetails {
    id: number;
    status: string;
    date: string;
    time: string;
    location: string;
    type: string;
    doctor: DoctorInfo;
    clinic: ClinicInfo;
    notes: string;
    instructions: string;
}


export interface AppointmentDetailsState {
    data: AppointmentDetails;
    loading: boolean;
    error: string | null;
}


const initialState: AppointmentDetailsState = {
    data: {
        id: 0,
        status: "",
        date: "",
        time: "",
        location: "",
        type: "",
        doctor: {
            id: 0,
            name: "",
            specialization: "",
            imageUrl: null,
            rating: 0,
            experienceYears: 0,
            governments: null,
        },
        clinic: {
            clinicName: "",
            clinicLocation: "",
            clinicEmail: "",
            clinicWebsite: "",
            clinicHours: "",
            clinicPhoneNumber: "",
        },
        notes: "",
        instructions: "",
    },
    loading: false,
    error: null,
};

export const fetchAppointmentDetails = createAsyncThunk(
    'appointmentDetailsSlice/fetchAppointmentDetails',
    async ({ id }: { id: string }, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(
                `${backendUrl}Patient/${id}`,
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

export const appointmentDetailsSlice = createSlice({
    name: 'appointmentDetailsSlice',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointmentDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAppointmentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data;
            })
            .addCase(fetchAppointmentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});


// state
export const appointmentDetailsState = (state: RootState) => state.appointmentDetailsSlice

export default appointmentDetailsSlice.reducer;