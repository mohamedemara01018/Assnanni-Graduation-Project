import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PrescriptionItem {
    medicationName: string;
    dosage: string;
    frequency: string;
    durationInDays: number;
}

export interface Prescription {
    id: number;
    diagnosis: string;
    notes: string;
    date: string; // ISO DateTime
    items: PrescriptionItem[];
}

export interface DoctorFeedback {
    feedbackId: string,
    appointmentId: string,
    rating: number;
    comment: string;
    createdAt: string; // ISO DateTime
}

export interface MyDoctor {
    doctorId: number;
    name: string;
    imageUrl: string;
    specialization: string;
    rating: number;
    experienceYears: number;
    clinicName: string;
    clinicEmail: string | null;
    clinicWebsite: string | null;
    clinicHours: string | null;
    clinicPhoneNumber: string;
    governments: string[] | null;
    lastAppointmentDate: string; // ISO date
    prescriptions: Prescription[];
    feedbacks: DoctorFeedback[];
}

export interface MyDoctorsData {
    items: MyDoctor[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageNumber: number | null;
    previousPageNumber: number | null;
}

export interface MyDoctorsState {
    data: MyDoctorsData;
    loading: boolean;
    error: string | null;
}

export interface FetchMyDoctorsParams {
    search?: string;
    specializationId?: number | null;
    pageNumber?: number;
    pageSize?: number;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: MyDoctorsState = {
    data: {
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPageNumber: null,
        previousPageNumber: null,
    },
    loading: false,
    error: null,
};

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchMyDoctors = createAsyncThunk(
    "myDoctorsSlice/fetchMyDoctors",
    async (
        { search = "", specializationId, pageNumber = 1, pageSize = 10 }: FetchMyDoctorsParams = {},
        { rejectWithValue }
    ) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (specializationId != null) params.set("specializationId", String(specializationId));
            params.set("pageNumber", String(pageNumber));
            params.set("pageSize", String(pageSize));

            const response = await fetch(
                `${backendUrl}Patient/my-doctors?${params.toString()}`,
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

// ─── Slice ────────────────────────────────────────────────────────────────────

export const myDoctorsSlice = createSlice({
    name: "myDoctorsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data;
            })
            .addCase(fetchMyDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const myDoctorsState = (state: RootState) => state.myDoctorsSlice;

export default myDoctorsSlice.reducer;
