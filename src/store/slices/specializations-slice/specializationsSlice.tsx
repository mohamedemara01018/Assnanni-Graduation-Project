import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store"; // Adjust path to your actual store config
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface SpecializationItem {
    id: number;
    name: string;
}

export interface SpecializationState {
    specializations: SpecializationItem[];
    loading: boolean;
    error: string | null;
    actionLoading: boolean; // Tracking independent loading indicator for POST/PUT/DELETE
}

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState: SpecializationState = {
    specializations: [],
    loading: false,
    error: null,
    actionLoading: false,
};

// ─── Async Thunks ────────────────────────────────────────────────────────────

/**
 * 1. Get All Specializations
 * GET /api/Specializations/GetAllSpecializations
 * Referenced from: image_d07fc7.png
 */
export const fetchAllSpecializations = createAsyncThunk<
    SpecializationItem[],
    void,
    { rejectValue: string }
>("specializations/fetchAllSpecializations", async (_, { rejectWithValue }) => {
    const cookieToken = Cookies.get("jwtToken");
    try {
        const response = await fetch(`${backendUrl}Specializations/GetAllSpecializations`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
                Accept: "*/*",
            },
        });

        const json = await response.json();

        if (!response.ok) {
            return rejectWithValue(json?.message || "Failed to retrieve specializations");
        }

        // The array is direct in the response root according to image_d07fc7.png
        return json || [];
    } catch (err: any) {
        return rejectWithValue(err.message || "Something went wrong");
    }
});

/**
 * 2. Add New Specialization
 * POST /api/Specializations/AddSpecialization
 * Referenced from: image_d07bc7.png
 */
export const addSpecialization = createAsyncThunk<
    number, // Returns the generated ID number (e.g., 6)
    { name: string },
    { rejectValue: string }
>("specializations/addSpecialization", async (payload, { rejectWithValue }) => {
    const cookieToken = Cookies.get("jwtToken");
    try {
        const response = await fetch(`${backendUrl}Specializations/AddSpecialization`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${cookieToken}`,
                "Content-Type": "application/json",
                "Accept": "*/*",
            },
            body: JSON.stringify(payload),
        });

        const textResult = await response.text();

        if (!response.ok) {
            const parsedError = textResult ? JSON.parse(textResult) : null;
            return rejectWithValue(parsedError?.message || "Failed to add specialization");
        }

        // Returns numerical string ID value like "6" from image_d07bc7.png response body
        return Number(textResult);
    } catch (err: any) {
        return rejectWithValue(err.message || "Something went wrong");
    }
});

/**
 * 3. Update Specialization
 * PUT /api/Specializations/{id}
 * Referenced from: image_d07f2b.png
 */
export const updateSpecialization = createAsyncThunk<
    SpecializationItem,
    SpecializationItem,
    { rejectValue: string }
>("specializations/updateSpecialization", async (payload, { rejectWithValue }) => {
    const cookieToken = Cookies.get("jwtToken");
    try {
        const response = await fetch(`${backendUrl}Specializations/${payload.id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${cookieToken}`,
                "Content-Type": "application/json",
                "Accept": "*/*",
            },
            body: JSON.stringify(payload), // Send payload structure matching image_d07f2b.png
        });

        const json = await response.json();

        if (!response.ok) {
            return rejectWithValue(json?.message || "Failed to update specialization");
        }

        return payload; // Return structural changes to update local Redux state arrays smoothly
    } catch (err: any) {
        return rejectWithValue(err.message || "Something went wrong");
    }
});

/**
 * 4. Delete Specialization
 * DELETE /api/Specializations/{id}
 * Referenced from: image_d07c62.png
 */
export const deleteSpecialization = createAsyncThunk<
    number, // Returns target dynamic ID to splice out matching records
    number,
    { rejectValue: string }
>("specializations/deleteSpecialization", async (id, { rejectWithValue }) => {
    const cookieToken = Cookies.get("jwtToken");
    try {
        const response = await fetch(`${backendUrl}Specializations/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${cookieToken}`,
                "Content-Type": "application/json", // Layout explicitly expects content-type declaration inside image_d07c62.png
            },
            body: JSON.stringify({ id }), // Matches structural criteria visible in image_d07c62.png
        });

        if (!response.ok) {
            const json = await response.json();
            return rejectWithValue(json?.message || "Failed to remove specialization");
        }

        return id;
    } catch (err: any) {
        return rejectWithValue(err.message || "Something went wrong");
    }
});

// ─── Slice Definition ────────────────────────────────────────────────────────
export const specializationsSlice = createSlice({
    name: "specializations",
    initialState,
    reducers: {
        clearSpecializationError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Records Lifecycle (image_d07fc7.png)
            .addCase(fetchAllSpecializations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSpecializations.fulfilled, (state, action) => {
                state.loading = false;
                state.specializations = action.payload;
            })
            .addCase(fetchAllSpecializations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Add Actions Lifecycle (image_d07bc7.png)
            .addCase(addSpecialization.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(addSpecialization.fulfilled, (state) => {
                state.actionLoading = false;
                // Note: Re-fetching all or appending depends on usage. 
                // Since the API only returns a flat number ID rather than the entity, 
                // dispatching `fetchAllSpecializations()` inside components post-creation is recommended.
            })
            .addCase(addSpecialization.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as string;
            })

            // Update Actions Lifecycle (image_d07f2b.png)
            .addCase(updateSpecialization.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateSpecialization.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.specializations.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.specializations[index] = action.payload;
                }
            })
            .addCase(updateSpecialization.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as string;
            })

            // Delete Actions Lifecycle (image_d07c62.png)
            .addCase(deleteSpecialization.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteSpecialization.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.specializations = state.specializations.filter(item => item.id !== action.payload);
            })
            .addCase(deleteSpecialization.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors & Actions ─────────────────────────────────────────────────────
export const { clearSpecializationError } = specializationsSlice.actions;

export const selectSpecializationsState = (state: RootState) => state.specializationsSlice;

export default specializationsSlice.reducer;