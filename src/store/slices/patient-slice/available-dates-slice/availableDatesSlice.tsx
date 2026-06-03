import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;



interface ScheduleData {
    date: string;
}

export interface ScheduleDatesState {
    data: ScheduleData[];
    loading: boolean;
    error: string | null;
}


const initialState: ScheduleDatesState = {
    data: [
        { date: '' }
    ],
    loading: false,
    error: null,
};
export const fetchAvailableDates = createAsyncThunk(
    "availableDatesSlice/fetchAvailableDates",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {


            const response = await fetch(
                `${backendUrl}Patient/available-dates?DoctorId=${id}`,
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




export const availableDatesSlice = createSlice({
    name: "availableDatesSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvailableDates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAvailableDates.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data;
            })

            .addCase(fetchAvailableDates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const availableDatesState = (state: RootState) =>
    state.availableDatesSlice;

export default availableDatesSlice.reducer;