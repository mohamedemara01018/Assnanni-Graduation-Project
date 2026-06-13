import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface SupportTicketFilters {
    status?: string;
    search?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface TicketItem {
    id: number;
    fullName: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
}

export interface SupportTicketsState {
    data: TicketItem[] | null;
    loading: boolean;
    success: boolean;
    error: string | null;
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: SupportTicketsState = {
    data: null,
    loading: false,
    success: false,
    error: null,
};

// ─── Async Thunk (GET) ───────────────────────────────────────────────────────
export const fetchSupportTickets = createAsyncThunk<
    TicketItem[],                 // Returns the parsed tickets array on success
    SupportTicketFilters | void,  // Accepts optional search, status filtering, and pagination query params
    { rejectValue: string }
>(
    "supportTicket/fetchSupportTickets",
    async (filters, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            // Build out optional dynamic query parameters safely
            const queryParams = new URLSearchParams();
            if (filters) {
                if (filters.status) queryParams.append("Status", filters.status);
                if (filters.search) queryParams.append("Search", filters.search);
                if (filters.pageNumber) queryParams.append("PageNumber", filters.pageNumber.toString());
                if (filters.pageSize) queryParams.append("PageSize", filters.pageSize.toString());
            }

            const queryString = queryParams.toString();
            const url = `${backendUrl}SupportTicket/support-tickets${queryString ? `?${queryString}` : ""}`;

            // Matches GET /api/SupportTicket/support-tickets
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Accept": "text/plain", // Matches Swagger configuration header
                },
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to retrieve support tickets list"
                );
            }

            // Extracts the internal payload array from the generic API structure
            return json.data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const supportTicketsSlice = createSlice({
    name: "supportTickets",
    initialState,
    reducers: {
        clearSupportTicketsState: (state) => {
            state.data = null;
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSupportTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchSupportTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
            })
            .addCase(fetchSupportTickets.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { clearSupportTicketsState } = supportTicketsSlice.actions;

export const selectSupportTicketsState = (state: RootState) => state.supportTicketsSlice;

export default supportTicketsSlice.reducer;