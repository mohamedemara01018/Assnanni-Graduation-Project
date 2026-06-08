import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface PendingDoctor {
    doctorId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    birthDate: string | null;
    medicalLicenseNumber: string;
    clinicName: string;
    clinicLocation: string;
    clinicPhoneNumber: string;
    about: string;
    yearsOfExperience: number;
    country: string;
    city: string;
    street: string;
    details: string;
    degree: number;
    education: string;
    languages: string;
    price: number;
    fullProfileImageUrl: string | null;
    fullCertificateUrl: string | null;
    createdAt: string;
}

export interface PendingDoctorState {
    pendingDoctors: PendingDoctor[];
    loading: boolean;
    error: string | null;
}

const initialState: PendingDoctorState = {
    pendingDoctors: [],
    loading: false,
    error: null,
};
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const fetchPendingDoctor = createAsyncThunk(
    "pendingDoctorSlice/fetchPendingDoctor",
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");
        try {
            const response = await fetch(
                `${backendUrl}Admin/doctors/pending`,
                {
                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                    },
                }
            );

            if (!response.ok) {
                const error: any = await response.json();

                return rejectWithValue(
                    error.message || "Failed to fetch Pending Doctor"
                );
            }

            const json = await response.json();

            return json;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);
const pendingDoctorSlice = createSlice({
    name: 'pendingDoctorSlice',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchPendingDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingDoctor.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.pendingDoctors = action.payload.data
            })
            .addCase(fetchPendingDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload) || action.error.message || 'fetch pending doctors rejected';
            })
    }
})

export const selectPendingDoctor = (state: RootState) => state.pendingDoctorsSlice;
export default pendingDoctorSlice.reducer;