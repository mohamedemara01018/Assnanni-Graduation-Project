import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface EditFeedbackDto {
    appointmentId: number;
    rating: number;
    comment: string;
}

export interface EditFeedbackState {
    loading: boolean;
    success: boolean;
    error: string | null;
    message: string | null;
}

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchEditFeedback = createAsyncThunk<
    any,
    EditFeedbackDto,
    { rejectValue: string }
>(
    "editFeedbackSlice/fetchEditFeedback",
    async (feedbackData, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}FeedBacks`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookieToken}`,
                },
                body: JSON.stringify(feedbackData),
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

const initialState: EditFeedbackState = {
    loading: false,
    success: false,
    error: null,
    message: null,
};

export const editFeedbackSlice = createSlice({
    name: "editFeedbackSlice",
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
            .addCase(fetchEditFeedback.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(fetchEditFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.succeeded ?? true;
                state.message = action.payload?.data || "Feedback updated successfully";
            })
            .addCase(fetchEditFeedback.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetEditFeedbackStatus } = editFeedbackSlice.actions;

export const editFeedbackState = (state: RootState) => state.editFeedbackSlice;

export default editFeedbackSlice.reducer;