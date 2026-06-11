import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface AIModelItem {
    id: number;
    name: string;
    type: string;
    accuracy: number;
    f1Score: number;
    deployedDate: string; // ISO String format
}

export interface AIModelsState {
    models: AIModelItem[];
    loading: boolean;
    error: string | null;
}

// ─── Async Thunk ─────────────────────────────────────────────────────────────
export const fetchAllAIModels = createAsyncThunk<
    AIModelItem[],
    void,
    { rejectValue: string }
>(
    "aiModels/fetchAllAIModels",
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}Admin`, {
                headers: {
                    Authorization: `Bearer ${cookieToken}`,
                    Accept: "text/plain", // Matches Swagger accept type if needed
                },
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to fetch trained AI models"
                );
            }

            // Maps directly to the backend wrapper: json.data contains the array
            return json.data || [];
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: AIModelsState = {
    models: [],
    loading: false,
    error: null,
};

// ─── Slice Definition ────────────────────────────────────────────────────────
export const aiModelsSlice = createSlice({
    name: "aiModels",
    initialState,
    reducers: {
        // Clear state if needed on logout or unmount
        clearModelsState: (state) => {
            state.models = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAIModels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAIModels.fulfilled, (state, action) => {
                state.loading = false;
                state.models = action.payload;
            })
            .addCase(fetchAllAIModels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { clearModelsState } = aiModelsSlice.actions;
export const selectAIModelsState = (state: RootState) => state.aiModelsSlice;

export default aiModelsSlice.reducer;