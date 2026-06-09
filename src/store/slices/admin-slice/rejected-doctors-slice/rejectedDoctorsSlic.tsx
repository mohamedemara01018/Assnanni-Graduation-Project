import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { RootState } from "@/store/store";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// 1. Updated interface to match the exact schema from Swagger response body
export interface RejectedDoctor {
    doctorId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string | null;
    birthDate: string | null;
    medicalLicenseNumber: string;
    rejectionReason: string;
    clinicName: string;
    clinicLocation: string;
    clinicPhoneNumber: string;
    about: string;
    yearsOfExperience: number;
    country: string;
    city: string;
    street: string;
    details: string;
    education: string | null;
    languages: string[];
    price: number;
    fullProfileImageUrl: string | null,
    fullCertificateUrl: string | null
}

// 2. The API response envelope
export interface ApiResponse<T> {
    succeeded: boolean;
    message: string;
    data: T;
}

export interface RejectedDoctorsState {
    data: RejectedDoctor[];
    loading: boolean;
    error: string | null;
}

const initialState: RejectedDoctorsState = {
    data: [],
    loading: false,
    error: null,
};

// 3. Updated Thunk URL to target 'Admin/rejected-doctors'
export const fetchRejectedDoctors = createAsyncThunk(
    "rejectedDoctors/fetchRejectedDoctors",
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(
                `${backendUrl}Admin/rejected-doctors`,
                {
                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                    },
                }
            );

            const json: ApiResponse<RejectedDoctor[]> = await response.json();

            if (!response.ok || !json.succeeded) {
                return rejectWithValue(
                    json?.message || "Request failed to fetch rejected doctors"
                );
            }

            return json.data; // Passes the array of doctors directly to the fulfilled action
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

export const rejectedDoctorsSlice = createSlice({
    name: "rejectedDoctors",
    initialState,
    reducers: {
        clearRejectedDoctors: (state) => {
            state.data = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRejectedDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRejectedDoctors.fulfilled, (state, action: PayloadAction<RejectedDoctor[]>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchRejectedDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// 4. Fixed Selector name and slice reference
export const rejectedDoctorsState = (state: RootState) => state.rejectedDoctorsSlice;
export const { clearRejectedDoctors } = rejectedDoctorsSlice.actions;

export default rejectedDoctorsSlice.reducer;