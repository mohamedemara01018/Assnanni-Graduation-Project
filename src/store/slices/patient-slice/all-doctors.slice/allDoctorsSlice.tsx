import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface Doctor {
    doctorId: number;
    name: string;
    imageUrl: string | null;
    specialization: string;
    tags: string[];
    rating: number;
    reviewsCount: number;
    yearsOfExperience: number;
    clinicName: string;
    city: string;
    status: string;
    price: number;
}

export interface DoctorsData {
    items: Doctor[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageNumber: number | null;
    previousPageNumber: number | null;
}

export interface DoctorsState {
    data: DoctorsData;
    loading: boolean;
    error: string | null;
}

export interface DoctorsFilters {
    Search: string,
    SpecializationId?: number;
    Experience?: string;
    RatingFilter?: string;
    Availability?: string;
    Gender?: string;
    SortBy?: string;
    Page?: number;
    PageSize?: number;
}

const initialState: DoctorsState = {
    data: {
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPageNumber: null,
        previousPageNumber: null,
    },
    loading: false,
    error: null,
};

export const fetchAllDoctors = createAsyncThunk(
    "allDoctorsSlice/fetchAllDoctors",
    async (filters: DoctorsFilters, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            // create query params dynamically
            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, String(value));
                }
            });

            const response = await fetch(
                `${backendUrl}Patient/all-doctors?${queryParams.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                    },
                }
            );

            const json = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    json?.message || json?.error || "Request failed"
                );
            }

            return json;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong");
        }
    }
);

export const allDoctorsSlice = createSlice({
    name: "allDoctorsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAllDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
            })

            .addCase(fetchAllDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const allDoctorsState = (state: RootState) =>
    state.allDoctorsSlice;

export default allDoctorsSlice.reducer;