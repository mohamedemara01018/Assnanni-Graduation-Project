import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface CreateFeedbackDto {
    appointmentId: number;
    rating: number;
    comment: string;
}

export interface CreateFeedbackState {
    loading: boolean;
    success: boolean;
    error: string | null;
    message: string | null;
}

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchAddFeedback = createAsyncThunk<
    any,
    CreateFeedbackDto, // Sets the argument type for the thunk dispatch
    { rejectValue: string }
>(
    "fetchAddFeedbackSlice/fetchAddFeedback",
    async (feedbackData: CreateFeedbackDto, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}FeedBacks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookieToken}`,
                },
                body: JSON.stringify(feedbackData),
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || "Submission failed"
                );
            }

            return json;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: CreateFeedbackState = {
    loading: false,
    success: false,
    error: null,
    message: null,
};

export const fetchAddFeedbackSlice = createSlice({
    name: "fetchAddFeedbackSlice",
    initialState,
    reducers: {
        resetAddFeedbackStatus: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddFeedback.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(fetchAddFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.succeeded ?? true;
                state.message = action.payload?.data || "Feedback submitted successfully";
            })
            .addCase(fetchAddFeedback.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetAddFeedbackStatus } = fetchAddFeedbackSlice.actions;

// Fixed to target the correct slice name mapping
export const addFeedbackState = (state: RootState) => state.addFeedbackSlice;

export default fetchAddFeedbackSlice.reducer;