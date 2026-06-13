import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface SupportTicketPayload {
    fullName: string;
    email: string;
    subject: string;
    message: string;
}

export interface SupportTicketState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: SupportTicketState = {
    loading: false,
    success: false,
    error: null,
};

// ─── Async Thunk (POST) ──────────────────────────────────────────────────────
export const createSupportTicket = createAsyncThunk<
    string,               // Returns the success message string on fulfillment
    SupportTicketPayload, // Expects the full body payload matching the API schema
    { rejectValue: string }
>(
    "supportTicket/createSupportTicket",
    async (ticketData, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            // Matches POST /api/SupportTicket/create-support-ticket
            const response = await fetch(`${backendUrl}SupportTicket/create-support-ticket`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Content-Type": "application/json",
                    "Accept": "text/plain", // Matches Swagger configuration header
                },
                body: JSON.stringify(ticketData),
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to submit support ticket"
                );
            }

            // Returns the backend success confirmation text string
            return json?.data || "Support ticket created successfully";
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const supportTicketSlice = createSlice({
    name: "supportTicket",
    initialState,
    reducers: {
        resetSupportTicketState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSupportTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createSupportTicket.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(createSupportTicket.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { resetSupportTicketState } = supportTicketSlice.actions;

export const selectSupportTicketState = (state: RootState) => state.supportTicketSlice;

export default supportTicketSlice.reducer;