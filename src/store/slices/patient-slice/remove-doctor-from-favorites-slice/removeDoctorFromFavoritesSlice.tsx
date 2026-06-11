import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface OperationState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

export interface DeleteFavoriteState {
    deleteState: OperationState;
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialOpState = (): OperationState => ({
    loading: false,
    success: false,
    error: null,
});

const initialState: DeleteFavoriteState = {
    deleteState: initialOpState(),
};

// ─── Async Thunk (DELETE) ────────────────────────────────────────────────────
export const removeDoctorFromFavorites = createAsyncThunk<
    number, // Returns the deleted doctorId on success
    number, // Expects doctorId as input
    { rejectValue: string }
>(
    "favoriteDoctors/removeDoctorFromFavorites",
    async (doctorId, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}FavoriteDoctors/${doctorId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Accept": "text/plain",
                },
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to remove doctor from favorites"
                );
            }

            return doctorId;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const deleteFavoriteSlice = createSlice({
    name: "deleteFavorite",
    initialState,
    reducers: {
        resetDeleteFavoriteState: (state) => {
            state.deleteState = initialOpState();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(removeDoctorFromFavorites.pending, (state) => {
                state.deleteState.loading = true;
                state.deleteState.error = null;
                state.deleteState.success = false;
            })
            .addCase(removeDoctorFromFavorites.fulfilled, (state) => {
                state.deleteState.loading = false;
                state.deleteState.success = true;
            })
            .addCase(removeDoctorFromFavorites.rejected, (state, action) => {
                state.deleteState.loading = false;
                state.deleteState.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { resetDeleteFavoriteState } = deleteFavoriteSlice.actions;

export const selectDeleteFavoriteState = (state: RootState) => state.deleteFavoriteSlice;

export default deleteFavoriteSlice.reducer;