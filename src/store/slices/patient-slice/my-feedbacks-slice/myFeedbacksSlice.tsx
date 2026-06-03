import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface FeedbackItem {
    feedbackId: number;
    doctorId: number;
    doctorName: string;
    specialization: string;
    experienceYears: number;
    clinicName: string;
    clinicLocation: string;
    doctorImage: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface FeedbackData {
    items: FeedbackItem[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageNumber: number | null;
    previousPageNumber: number | null;
}

export interface FeedbackState {
    data: FeedbackData;
    loading: boolean;
    error: string | null;
}

// ─── Params ───────────────────────────────────────────────────────────────────

export interface FetchMyFeedbacksParams {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
    rating?: number | null;
}

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchMyFeedbacks = createAsyncThunk(
    "myFeedbacksSlice/fetchMyFeedbacks",
    async (
        { search = "", pageNumber = 1, pageSize = 10, rating }: FetchMyFeedbacksParams = {},
        { rejectWithValue }
    ) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (pageNumber) params.set("pageNumber", String(pageNumber));
            if (pageSize) params.set("pageSize", String(pageSize));
            if (rating != null) params.set("rating", String(rating));

            const response = await fetch(
                `${backendUrl}Patient/my-feedbacks?${params.toString()}`,
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

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: FeedbackState = {
    data: {
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPageNumber: null,
        previousPageNumber: null,
    },
    loading: false,
    error: null,
};

export const myFeedbacksSlice = createSlice({
    name: "myFeedbacksSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyFeedbacks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyFeedbacks.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data;
            })
            .addCase(fetchMyFeedbacks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const myFeedbacksState = (state: RootState) => state.myFeedbacksSlice;

export default myFeedbacksSlice.reducer;
