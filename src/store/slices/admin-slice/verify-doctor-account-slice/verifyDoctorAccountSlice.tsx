import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface VerifyDoctorState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: VerifyDoctorState = {
    loading: false,
    success: false,
    error: null,
};

// ─── Async Thunk (POST) ──────────────────────────────────────────────────────
export const verifyDoctorAccount = createAsyncThunk<
    number, // Returns the verified doctorId on success
    number, // Expects doctorId as input parameter passed in the path URL
    { rejectValue: string }
>(
    "admin/verifyDoctorAccount",
    async (doctorId, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            // Matches POST /api/Admin/verify-doctor/${doctorId}
            const response = await fetch(`${backendUrl}Admin/verify-doctor/${doctorId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Accept": "*/*",
                },
                body: "", // Body is sent empty as specified by the -d '' flag
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to verify doctor account"
                );
            }

            return doctorId;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const verifyDoctorSlice = createSlice({
    name: "verifyDoctor",
    initialState,
    reducers: {
        resetVerifyDoctorState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyDoctorAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(verifyDoctorAccount.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(verifyDoctorAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { resetVerifyDoctorState } = verifyDoctorSlice.actions;

// Selector updated to match the flat structure
export const selectVerifyDoctorState = (state: RootState) => state.verifyDoctorSlice;

export default verifyDoctorSlice.reducer;