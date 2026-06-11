import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────

// The un-nested, flat payload expected by the PUT request body in Swagger
export interface UpdateAIModelPayload {
    name: string;
    description: string;
    deployedDate: string;
    type: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    datasetName: string;
    totalImages: number;
    epochs: number;
    batchSize: number;
    learningRate: number;
    optimizer: string;
    trainingTime: string;
    gpuUsed: string;
}

export interface UpdateAIModelArgs {
    id: number | string;
    payload: UpdateAIModelPayload;
}

export interface UpdateAIModelState {
    loading: boolean;
    success: boolean;
    error: string | null;
    successMessage: string | null;
}

// ─── Async Thunk ─────────────────────────────────────────────────────────────

export const updateAIModel = createAsyncThunk<
    string, // Returns the backend success message string on success
    UpdateAIModelArgs,
    { rejectValue: string }
>(
    "updateAIModel/updateAIModel",
    async ({ id, payload }, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}Admin/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${cookieToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to update the AI model configuration"
                );
            }

            // Extracts the text string payload: "AIModel Details Updated Successfully"
            return json.data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState: UpdateAIModelState = {
    loading: false,
    success: false,
    error: null,
    successMessage: null,
};

// ─── Slice Definition ────────────────────────────────────────────────────────

export const updateAIModelSlice = createSlice({
    name: "updateAIModel",
    initialState,
    reducers: {
        resetUpdateState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateAIModel.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateAIModel.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.success = true;
                state.successMessage = action.payload;
            })
            .addCase(updateAIModel.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Actions & Selectors ─────────────────────────────────────────────────────

export const { resetUpdateState } = updateAIModelSlice.actions;
export const selectUpdateAIModelState = (state: RootState) => state.updateAIModelSlice;

export default updateAIModelSlice.reducer;