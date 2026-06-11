import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface AIModelPayload {
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

interface OperationState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

export interface CreateModelFieldsState {
    createState: OperationState;
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialOpState = (): OperationState => ({
    loading: false,
    success: false,
    error: null,
});

const initialState: CreateModelFieldsState = {
    createState: initialOpState(),
};

// ─── Async Thunk (POST) ──────────────────────────────────────────────────────
export const createAIModel = createAsyncThunk<
    any,
    AIModelPayload,
    { rejectValue: string }
>(
    "aiModels/createAIModel",
    async (payload, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}Admin/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Content-Type": "application/json",
                    "Accept": "text/plain",
                },
                body: JSON.stringify(payload),
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(json?.message || "Failed to create new AI model");
            }

            return json;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const createModelSlice = createSlice({
    name: "createModel",
    initialState,
    reducers: {
        resetCreateState: (state) => {
            state.createState = initialOpState();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAIModel.pending, (state) => {
                state.createState.loading = true;
                state.createState.error = null;
                state.createState.success = false;
            })
            .addCase(createAIModel.fulfilled, (state) => {
                state.createState.loading = false;
                state.createState.success = true;
            })
            .addCase(createAIModel.rejected, (state, action) => {
                state.createState.loading = false;
                state.createState.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { resetCreateState } = createModelSlice.actions;

export const selectCreateAIModelState = (state: RootState) => state.createModelSlice;

export default createModelSlice.reducer;