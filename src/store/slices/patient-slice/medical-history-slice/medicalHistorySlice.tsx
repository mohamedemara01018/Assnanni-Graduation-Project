import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Attachment {
    id: number;
    fileName: string;
    fileUrl: string;
}

export interface MedicalRecord {
    appointmentId: number;
    title: string;
    doctorName: string;
    date: string;
    type: string;
    description: string;
    attachments: Attachment[];
}

export interface MedicalHistoryState {
    records: MedicalRecord[];
    loading: boolean;
    success: boolean;
    error: string | null;
    message: string | null;
}

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchMedicalHistory = createAsyncThunk<
    any,
    void,
    { rejectValue: string }
>(
    "medicalHistorySlice/fetchMedicalHistory",
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}Patient/medical-history`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookieToken}`,
                },
            });

            const text = await response.text();
            const json = text ? JSON.parse(text) : null;

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || `Request failed (${response.status})`
                );
            }

            return json ?? true;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: MedicalHistoryState = {
    records: [],
    loading: false,
    success: false,
    error: null,
    message: null,
};

export const medicalHistorySlice = createSlice({
    name: "medicalHistorySlice",
    initialState,
    reducers: {
        resetMedicalHistoryStatus: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMedicalHistory.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(fetchMedicalHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.succeeded ?? true;
                state.records = action.payload?.data ?? [];
                state.message = action.payload?.message || "Fetched successfully";
            })
            .addCase(fetchMedicalHistory.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetMedicalHistoryStatus } = medicalHistorySlice.actions;

export const medicalHistoryState = (state: RootState) => state.medicalHistorySlice;

export default medicalHistorySlice.reducer;