import type { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

/* ================= TYPES ================= */

export interface SearchPendingDoctor {
    doctorId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    birthDate: string | null;
    medicalLicenseNumber: string;
    clinicName: string;
    clinicLocation: string;
    clinicPhoneNumber: string;
    about: string;
    yearsOfExperience: number;
    country: string;
    city: string;
    street: string;
    details: string;
    degree: number;
    education: string | null;
    languages: string;
    price: number;
    fullProfileImageUrl: string;
    fullCertificateUrl: string;
    createdAt: string;
}

export interface SearchPendingDoctorState {
    doctors: SearchPendingDoctor[];
    error: string | null;
    loading: boolean;
}

interface ResponseFormat {
    isSuccess: boolean;
    status: string;
    error: string;
    value: {
        doctors: SearchPendingDoctor[];
    };
}

interface ParamsFormat {
    searchTerm?: string;
    pageNumber?: number;
    pageSize?: number;
}

/* ================= INITIAL STATE ================= */

const initialState: SearchPendingDoctorState = {
    doctors: [],
    error: null,
    loading: false,
};

/* ================= API ================= */

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/* ================= THUNK ================= */

export const fetchSearchPendingDoctor = createAsyncThunk<
    ResponseFormat,
    ParamsFormat,
    { rejectValue: string }
>(
    "searchPendingDoctorSlice/fetchSearchPendingDoctor",

    async (
        {
            searchTerm = "",
            pageNumber = 1,
            pageSize = 10,
        },
        { rejectWithValue }
    ) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(
                `${backendUrl}Admin/pending-doctors/filter`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${cookieToken}`,
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        searchTerm,
                        pageNumber,
                        pageSize,
                    }),
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

/* ================= SLICE ================= */

const searchPendingDoctorSlice = createSlice({
    name: "searchPendingDoctorSlice",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder

            /* ===== PENDING ===== */
            .addCase(fetchSearchPendingDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            /* ===== FULFILLED ===== */
            .addCase(fetchSearchPendingDoctor.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload.value.doctors;
            })

            /* ===== REJECTED ===== */
            .addCase(fetchSearchPendingDoctor.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload || action.error.message || "Error occurred";
            });
    },
});

/* ================= SELECTOR ================= */

export const selectSearchPendingDoctor = (state: RootState) =>
    state.searchPendingDoctorSlice;

/* ================= EXPORT ================= */

export default searchPendingDoctorSlice.reducer;