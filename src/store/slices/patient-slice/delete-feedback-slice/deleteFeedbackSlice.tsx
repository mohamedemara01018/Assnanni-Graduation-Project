import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface DeleteFeedbackDto {
    appointmentId: number;
}

export interface DeleteFeedbackState {
    loading: boolean;
    success: boolean;
    error: string | null;
    message: string | null;
}

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchDeleteFeedback = createAsyncThunk<
    any,
    DeleteFeedbackDto,
    { rejectValue: string }
>(
    "deleteFeedbackSlice/fetchDeleteFeedback",
    async ({ appointmentId }, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}FeedBacks/${appointmentId}`, {
                method: "DELETE",
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

const initialState: DeleteFeedbackState = {
    loading: false,
    success: false,
    error: null,
    message: null,
};

export const deleteFeedbackSlice = createSlice({
    name: "deleteFeedbackSlice",
    initialState,
    reducers: {
        resetEditFeedbackStatus: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeleteFeedback.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(fetchDeleteFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.succeeded ?? true;
                state.message = action.payload?.data || "Feedback updated successfully";
            })
            .addCase(fetchDeleteFeedback.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetEditFeedbackStatus } = deleteFeedbackSlice.actions;

export const deleteFeedbackState = (state: RootState) => state.deleteFeedbackSlice;

export default deleteFeedbackSlice.reducer;