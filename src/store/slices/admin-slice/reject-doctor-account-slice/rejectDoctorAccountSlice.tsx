import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface RejectDoctorState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: RejectDoctorState = {
    loading: false,
    success: false,
    error: null,
};

// ─── Async Thunk (POST) ──────────────────────────────────────────────────────
export const rejectDoctorAccount = createAsyncThunk<
    number, // Returns the rejected doctorId on success
    { doctorId: number; reason: string }, // Expects both the URL parameter and the string body
    { rejectValue: string }
>(
    "admin/rejectDoctorAccount",
    async ({ doctorId, reason }, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            // Matches POST /api/Admin/reject-doctor/{doctorId}
            const response = await fetch(`${backendUrl}Admin/reject-doctor/${doctorId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                },
                // Passes the raw string reason in the request body as shown in the curl -d '"string"'
                body: JSON.stringify(reason),
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to reject doctor account"
                );
            }

            return doctorId;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const rejectDoctorSlice = createSlice({
    name: "rejectDoctor",
    initialState,
    reducers: {
        resetRejectDoctorState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(rejectDoctorAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(rejectDoctorAccount.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(rejectDoctorAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { resetRejectDoctorState } = rejectDoctorSlice.actions;

export const selectRejectDoctorState = (state: RootState) => state.rejectDoctorSlice;

export default rejectDoctorSlice.reducer;