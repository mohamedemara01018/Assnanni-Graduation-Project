import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path based on your real store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface SupportTicketReplyPayload {
    ticketId: number;
    reply: string;
}

export interface SupportReplyState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: SupportReplyState = {
    loading: false,
    success: false,
    error: null,
};

// ─── Async Thunk ────────────────────────────────────────────────────────────
/**
 * Submits an administrative reply to a specific open support ticket
 * POST /api/SupportTicket/support-tickets/reply
 */
export const replyToSupportTicket = createAsyncThunk<
    string,                         // Returns success message string on fulfillment
    SupportTicketReplyPayload,      // Request body payload containing ticketId and reply message
    { rejectValue: string }
>(
    "supportReply/replyToSupportTicket",
    async (replyData, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");
        try {
            const response = await fetch(`${backendUrl}SupportTicket/support-tickets/reply`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Content-Type": "application/json",
                    "Accept": "text/plain", // Matches Swagger accept parameter setup
                },
                body: JSON.stringify(replyData),
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to submit response to the support ticket"
                );
            }

            // Extracts "Reply sent successfully" value from the response payload wrapper
            return json?.data || "Reply sent successfully";
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const supportReplySlice = createSlice({
    name: "supportReply",
    initialState,
    reducers: {
        resetSupportReplyState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(replyToSupportTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(replyToSupportTicket.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(replyToSupportTicket.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { resetSupportReplyState } = supportReplySlice.actions;

export const selectSupportReplyState = (state: RootState) => state.supportReplySlice;

export default supportReplySlice.reducer;