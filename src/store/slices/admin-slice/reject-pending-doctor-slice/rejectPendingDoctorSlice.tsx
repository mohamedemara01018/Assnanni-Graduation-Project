


import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

/* ================= TYPES ================= */

export interface RejectPendingDoctorState {
    message: string
    error: string | null;
    loading: boolean;
}

interface ResponseFormat {
    succeeded: boolean,
    message: string,
}

interface ParamsFormat {
    reason?: string
    id?: string
}

/* ================= INITIAL STATE ================= */

const initialState: RejectPendingDoctorState = {
    message: '',
    error: null,
    loading: false,
};

/* ================= API ================= */

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/* ================= THUNK ================= */

export const fetchRejectPendingDoctor = createAsyncThunk<
    ResponseFormat,
    ParamsFormat,
    { rejectValue: string }
>(
    "rejectPendingDoctorSlice/fetchRejectPendingDoctor",

    async (
        { reason = "", id },
        { rejectWithValue }
    ) => {
        const cookieToken = Cookies.get("jwtToken");
        // console.log(id)
        try {
            const response = await fetch(
                `${backendUrl}Admin/doctors/${id}/reject`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reason
                    }),
                }
            );

            console.log('response', response)

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || "Request failed"
                );
            }
            console.log('json', json)
            return json;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

/* ================= SLICE ================= */

const rejectPendingDoctorSlice = createSlice({
    name: "rejectPendingDoctorSlice",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            /* ===== PENDING ===== */
            .addCase(fetchRejectPendingDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = '';
            })

            /* ===== FULFILLED ===== */
            .addCase(fetchRejectPendingDoctor.fulfilled, (state) => {
                state.loading = false;
                state.message = 'Approved successfully'
            })

            /* ===== REJECTED ===== */
            .addCase(fetchRejectPendingDoctor.rejected, (state, action) => {
                state.loading = false;
                state.message = '';
                state.error =
                    action.payload || action.error.message || "Error occurred";
            });
    },
});

/* ================= SELECTOR ================= */

export const selectRejectPendingDoctor = (state: RootState) =>
    state.rejectPendingDoctorSlice;

/* ================= EXPORT ================= */

export default rejectPendingDoctorSlice.reducer;