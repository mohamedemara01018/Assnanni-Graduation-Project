import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    durationInDays: number;
}

export interface Prescription {
    id: number;
    diagnosis: string;
    doctorId: number;
    doctorImage: string;
    doctorName: string;
    date: string; // ISO format string (e.g., "2026-05-23")
    notes: string;
    medications: Medication[];
}

export interface PrescriptionsState {
    data: Prescription[];
    loading: boolean;
    error: string | null;
}

const initialState: PrescriptionsState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchPresciptions = createAsyncThunk(
    'prescriptionsSlice/fetchPresciptions',
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(
                `${backendUrl}Patient/prescriptions`,
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

export const prescriptionsSlice = createSlice({
    name: 'prescriptionsSlice',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPresciptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPresciptions.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data;
            })
            .addCase(fetchPresciptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});


// state
export const prescriptiondState = (state: RootState) => state.prescriptionsSlice

export default prescriptionsSlice.reducer;