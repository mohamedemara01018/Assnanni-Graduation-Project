import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface DoctorDetails {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    reviewsCount: number;
    yearsOfExperience: number;
    consultationPrice: number;
    about: string;
    education: string;
    languages: string[];
    clinicName: string;
    clinicLocation: string;
    isAvailable: boolean;
    timeSlots: any[];
    reviews: any[];
}

export interface DoctorDetailsState {
    data: DoctorDetails;
    loading: boolean;
    error: string | null;
}

const initialState: DoctorDetailsState = {
    data: {
        id: 0,
        name: "",
        specialty: "",
        rating: 0,
        reviewsCount: 0,
        yearsOfExperience: 0,
        consultationPrice: 0,
        about: "",
        education: "",
        languages: [],
        clinicName: "",
        clinicLocation: "",
        isAvailable: false,
        timeSlots: [],
        reviews: [],
    },
    loading: false,
    error: null,
};
export const fetchDoctorProfile = createAsyncThunk(
    "doctorProfileSlice/fetchDoctorProfile",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {


            const response = await fetch(
                `${backendUrl}Patient/doctor-profile/${id}`,
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

            return json;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

export const doctorProfileSlice = createSlice({
    name: "doctorProfileSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctorProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
            })

            .addCase(fetchDoctorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const doctorProfileState = (state: RootState) =>
    state.doctorProfileSlice;

export default doctorProfileSlice.reducer;