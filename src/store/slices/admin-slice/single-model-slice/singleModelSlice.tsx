import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface TrainingDetails {
    datasetName: string;
    totalImages: number;
    epochs: number;
    batchSize: number;
    learningRate: number;
    optimizer: string;
    trainingTime: string;
    gpuUsed: string;
}

export interface DetailedAIModel {
    id: number;
    name: string;
    description: string;
    deployedDate: string;
    type: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    trainingDetails: TrainingDetails; // Nested training metadata object
}

export interface SingleModelState {
    currentModel: DetailedAIModel | null;
    loading: boolean;
    error: string | null;
}

// ─── Async Thunk ─────────────────────────────────────────────────────────────
export const fetchModelById = createAsyncThunk<
    DetailedAIModel,
    number | string, // Accepts ID as a number or string parameter
    { rejectValue: string }
>(
    "singleModel/fetchModelById",
    async (id, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}Admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookieToken}`,
                    Accept: "text/plain",
                },
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to fetch model details"
                );
            }

            // Maps cleanly to your api wrapper: response -> json.data
            console.log(json.data)
            return json.data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: SingleModelState = {
    currentModel: null,
    loading: false,
    error: null,
};

// ─── Slice Definition ────────────────────────────────────────────────────────
export const singleModelSlice = createSlice({
    name: "singleModel",
    initialState,
    reducers: {
        clearCurrentModel: (state) => {
            state.currentModel = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchModelById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModelById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentModel = action.payload;
            })
            .addCase(fetchModelById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { clearCurrentModel } = singleModelSlice.actions;
export const selectSingleModelState = (state: RootState) => state.singleModelSlice;

export default singleModelSlice.reducer;