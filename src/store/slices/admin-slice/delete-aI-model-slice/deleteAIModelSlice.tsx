import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface DeleteAIModelState {
    loading: boolean;
    success: boolean;
    error: string | null;
    successMessage: string | null;
}

// ─── Async Thunk ─────────────────────────────────────────────────────────────
export const deleteAIModel = createAsyncThunk<
    string, // Returns the backend success message string on success
    number | string, // Accepts model ID as parameter
    { rejectValue: string }
>(
    "deleteAIModel/deleteAIModel",
    async (id, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}Admin/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${cookieToken}`,
                    Accept: "text/plain",
                },
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to delete the AI model"
                );
            }

            // Extracts the text string payload: "AI Model deleted successfully"
            return json.data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: DeleteAIModelState = {
    loading: false,
    success: false,
    error: null,
    successMessage: null,
};

// ─── Slice Definition ────────────────────────────────────────────────────────
export const deleteAIModelSlice = createSlice({
    name: "deleteAIModel",
    initialState,
    reducers: {
        resetDeleteState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteAIModel.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteAIModel.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.success = true;
                state.successMessage = action.payload;
            })
            .addCase(deleteAIModel.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Actions & Selectors ─────────────────────────────────────────────────────
export const { resetDeleteState } = deleteAIModelSlice.actions;
export const selectDeleteAIModelState = (state: RootState) => state.deleteAIModelSlice;

export default deleteAIModelSlice.reducer;