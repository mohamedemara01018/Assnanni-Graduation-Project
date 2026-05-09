


import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

/* ================= TYPES ================= */

export interface ApprovePendingDoctorState {
    message: string
    error: string | null;
    loading: boolean;
}

interface ResponseFormat {
    succeeded: boolean,
    message: string,
}

interface ParamsFormat {
    note?: string
    id?: string
}

/* ================= INITIAL STATE ================= */

const initialState: ApprovePendingDoctorState = {
    message: '',
    error: null,
    loading: false,
};

/* ================= API ================= */

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/* ================= THUNK ================= */

export const fetchApprovePendingDoctor = createAsyncThunk<
    ResponseFormat,
    ParamsFormat,
    { rejectValue: string }
>(
    "approvePendingDoctorSlice/fetchApprovePendingDoctor",

    async (
        { note = "", id },
        { rejectWithValue }
    ) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(
                `${backendUrl}Admin/doctors/${id}/verify`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        note
                    }),
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

/* ================= SLICE ================= */

const approvePendingDoctorSlice = createSlice({
    name: "approvePendingDoctorSlice",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            /* ===== PENDING ===== */
            .addCase(fetchApprovePendingDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = '';
            })

            /* ===== FULFILLED ===== */
            .addCase(fetchApprovePendingDoctor.fulfilled, (state) => {
                state.loading = false;
                state.message = 'Approved successfully'
            })

            /* ===== REJECTED ===== */
            .addCase(fetchApprovePendingDoctor.rejected, (state, action) => {
                state.loading = false;
                state.message = '';
                state.error =
                    action.payload || action.error.message || "Error occurred";
            });
    },
});

/* ================= SELECTOR ================= */

export const selectApprovePendingDoctor = (state: RootState) =>
    state.approvePendingDoctorSlice;

/* ================= EXPORT ================= */

export default approvePendingDoctorSlice.reducer;