import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your actual store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface SingleTicketData {
    id: number;
    fullName: string;
    email: string;
    subject: string;
    message: string;
    adminReply: string | null;
    status: string;
    createdAt: string;
    repliedAt: string | null;
}

export interface SingleTicketState {
    ticket: SingleTicketData | null;
    loading: boolean;
    error: string | null;
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: SingleTicketState = {
    ticket: null,
    loading: false,
    error: null,
};

// ─── Async Thunk ─────────────────────────────────────────────────────────────
/**
 * Get support ticket by ID
 * GET /api/SupportTicket/support-tickets/{id}
 */
export const fetchSupportTicketById = createAsyncThunk<
    SingleTicketData,
    number,
    { rejectValue: string }
>(
    "singleTicket/fetchSupportTicketById",
    async (id, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            // Requesting dynamic ID path
            const response = await fetch(`${backendUrl}SupportTicket/support-tickets/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Accept": "text/plain", // Matches Accept header configuration
                },
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(json?.message || "Failed to fetch support ticket details");
            }

            // Extract the ticket object located in response body under data property
            return json?.data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const singleTicketSlice = createSlice({
    name: "singleTicket",
    initialState,
    reducers: {
        clearSingleTicketState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSupportTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSupportTicketById.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload; // Successfully populates state
            })
            .addCase(fetchSupportTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { clearSingleTicketState } = singleTicketSlice.actions;

export const selectSingleTicketState = (state: RootState) => state.singleTicketSlice;

export default singleTicketSlice.reducer;