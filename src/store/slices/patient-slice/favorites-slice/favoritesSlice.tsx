import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface FavoriteDoctorItem {
    doctorId: number;
    doctorName: string;
    imageUrl: string;
    specialization: string;
    rating: number;
    experience: number;
    consultationFee: number;
    languages: string[];
    clinicName: string;
    clinicLocation: string;
    clinicEmail: string;
    clinicWebsite: string;
    clinicHours: string;
    clinicPhoneNumber: string;
    governments: string[];
}

export interface FavoriteDoctorsState {
    favoriteDoctors: FavoriteDoctorItem[];
    loading: boolean;
    error: string | null;
}

// ─── Async Thunk ─────────────────────────────────────────────────────────────
export const fetchFavoriteDoctors = createAsyncThunk<
    FavoriteDoctorItem[],
    void,
    { rejectValue: string }
>(
    "favoriteDoctors/fetchFavoriteDoctors",
    async (_, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(`${backendUrl}FavoriteDoctors`, {
                headers: {
                    Authorization: `Bearer ${cookieToken}`,
                    Accept: "text/plain",
                },
            });

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || "Failed to fetch favorite doctors list"
                );
            }

            // Maps directly to the backend wrapper: json.data contains the doctor objects array
            return json.data || [];
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: FavoriteDoctorsState = {
    favoriteDoctors: [],
    loading: false,
    error: null,
};

// ─── Slice Definition ────────────────────────────────────────────────────────
export const favoriteDoctorsSlice = createSlice({
    name: "favoriteDoctors",
    initialState,
    reducers: {
        clearFavoriteDoctorsState: (state) => {
            state.favoriteDoctors = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavoriteDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavoriteDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.favoriteDoctors = action.payload;
            })
            .addCase(fetchFavoriteDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { clearFavoriteDoctorsState } = favoriteDoctorsSlice.actions;
export const selectFavoriteDoctorsState = (state: RootState) => state.favoriteDoctorsSlice;

export default favoriteDoctorsSlice.reducer;