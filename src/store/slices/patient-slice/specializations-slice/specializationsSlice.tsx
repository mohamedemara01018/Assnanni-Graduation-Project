import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface Specialization {
    id: number;
    name: string;
}

// If you are setting up the state wrapper like the previous ones:
export interface SpecializationState {
    data: Specialization[];
    loading: boolean;
    error: string | null;
}



// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchSpecializations = createAsyncThunk(
    "spectializationsSlice/fetchSpecializations",
    async (
        _,
        { rejectWithValue }
    ) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(
                `${backendUrl}Specializations/GetAllSpecializations`,
                {
                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                    },
                }
            );

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || "Request failed"
                );
            }

            return json;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────


const initialState: SpecializationState = {
    data: [],
    loading: false,
    error: null,
};

export const spectializationsSlice = createSlice({
    name: "spectializationsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpecializations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSpecializations.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSpecializations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const specializtionsState = (state: RootState) => state.spectializationsSlice;

export default spectializationsSlice.reducer;
