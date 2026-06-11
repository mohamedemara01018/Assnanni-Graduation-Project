import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface AddFavoriteState {
    loading: boolean;
    success: boolean;
    error: string | null;
}


const initialState: AddFavoriteState = {
    loading: false,
    success: false,
    error: null,
};

// ─── Async Thunk (POST) ──────────────────────────────────────────────────────
export const addDoctorToFavorites = createAsyncThunk<
    number, // Returns the added doctorId on success
    number, // Expects doctorId as input parameter passed in the path
    { rejectValue: string }
>(
    "favoriteDoctors/addDoctorToFavorites",
    async (doctorId, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            // Path structure matching image_2f2df5.png endpoint documentation
            const response = await fetch(`${backendUrl}FavoriteDoctors/${doctorId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${cookieToken}`,
                    "Accept": "text/plain",
                },
                // Body is sent empty as specified by the -d '' flag in the curl command
                body: "",
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to add doctor to favorites"
                );
            }

            return doctorId;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Slice Definition ────────────────────────────────────────────────────────
export const addFavoriteSlice = createSlice({
    name: "addFavorite",
    initialState,
    reducers: {
        resetAddFavoriteState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addDoctorToFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addDoctorToFavorites.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(addDoctorToFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { resetAddFavoriteState } = addFavoriteSlice.actions;

export const selectAddFavoriteState = (state: RootState) => state.addFavoriteSlice;

export default addFavoriteSlice.reducer;