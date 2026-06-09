import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { RootState } from "@/store/store";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// 1. Matches the API response structure shown in the image
export interface ToggleStatusResponse {
    succeeded: boolean;
    message: string;
    data: boolean; // "data": true
    meta: any;     // "meta": null
}

export interface ToggleStatusState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: ToggleStatusState = {
    loading: false,
    success: false,
    error: null,
};

// 2. Thunk accepts a dynamic user ID and uses the PUT method
export const fetchToggleUserStatus = createAsyncThunk(
    "toggleStatusUsers/fetchToggleUserStatus",
    async (id: string, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(
                `${backendUrl}Admin/users/${id}/toggle-status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookieToken}`,
                    },
                }
            );

            const json: ToggleStatusResponse = await response.json();

            if (!response.ok || !json.succeeded) {
                return rejectWithValue(
                    json?.message || "Failed to toggle user status"
                );
            }

            return json; // Returns the full body containing data: true
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

export const toggleStatusUsersSlice = createSlice({
    name: "toggleStatusUsers",
    initialState,
    reducers: {
        resetToggleStatusState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchToggleUserStatus.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(fetchToggleUserStatus.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(fetchToggleUserStatus.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

// 3. Export clean selector and actions
export const selectToggleStatusState = (state: RootState) => state.toggleStatusUsersSlice;
export const { resetToggleStatusState } = toggleStatusUsersSlice.actions;

export default toggleStatusUsersSlice.reducer;