import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;



interface ScheduleData {

    "id": number,
    "startTime": string,
    "endTime": string
}

export interface ScheduleSlotsState {
    data: ScheduleData[];
    loading: boolean;
    error: string | null;
}


const initialState: ScheduleSlotsState = {
    data: [
        {
            id: -1,
            startTime: "",
            endTime: ""
        }
    ],
    loading: false,
    error: null,
};
export const fetchAvailableSlots = createAsyncThunk(
    "availableSlotsSlice/fetchAvailableSlots",
    async ({ date, id }: { date: string, id: string }, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {


            const response = await fetch(
                `${backendUrl}Patient/available-slots?Date=${date}&DoctorId=${id}`,
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




export const availableSlotsSlice = createSlice({
    name: "availableSlotsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvailableSlots.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
            })

            .addCase(fetchAvailableSlots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const availableSlotsState = (state: RootState) =>
    state.availableSlotsSlice;

export default availableSlotsSlice.reducer;