import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { RootState } from "@/store/store";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// 1. Request body interface matching your backend payload specifications
export interface CreatePaymentPayload {
    appointmentId: number;
    patientId: number;
    amount: number;
    currency: string;
    idempotencyKey: string;
    createdBy: string;
}

// 2. Response body interface exactly mapping the fields in your Swagger image
export interface PaymentResponse {
    success: boolean;
    paymentId: string;
    clientSecret: string;
    message: string;
}

export interface PaymentState {
    clientSecret: string | null;
    paymentId: string | null;
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    clientSecret: null,
    paymentId: null,
    loading: false,
    success: false,
    error: null,
};

// 3. Async Thunk targeting 'api/payments/create'
export const fetchCreatePayment = createAsyncThunk(
    "createPaymentSlice/fetchCreatePayment",
    async (paymentData: CreatePaymentPayload, { rejectWithValue }) => {
        const cookieToken = Cookies.get("jwtToken");

        try {
            const response = await fetch(
                `${backendUrl}payments/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookieToken}`,
                    },
                    body: JSON.stringify(paymentData),
                }
            );

            const json: PaymentResponse = await response.json();

            // Checking the custom "success" field shown in your Swagger response body
            if (!response.ok || !json.success) {
                return rejectWithValue(
                    json?.message || "Failed to create payment intent configuration."
                );
            }

            return json; // Returns { success, paymentId, clientSecret, message }
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong processing your transaction");
        }
    }
);

export const createPaymentSlice = createSlice({
    name: "createPaymentSlice",
    initialState,
    reducers: {
        resetPaymentState: (state) => {
            state.clientSecret = null;
            state.paymentId = null;
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreatePayment.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(fetchCreatePayment.fulfilled, (state, action: PayloadAction<PaymentResponse>) => {
                state.loading = false;
                state.success = true;
                state.clientSecret = action.payload.clientSecret;
                state.paymentId = action.payload.paymentId;
            })
            .addCase(fetchCreatePayment.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

// 4. Clean exports for store integration
export const selectPaymentState = (state: RootState) => state.createPaymentSlice;
export const { resetPaymentState } = createPaymentSlice.actions;

export default createPaymentSlice.reducer;