import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
// import { token } from "../utils";
import Cookies from "js-cookie";

/* ================= TYPES ================= */

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  gender: string | null;
  createdAt: string;
  imageUrl: string;
}

interface UsersResponse {
  succeeded: boolean;
  message: string;
  data: {
    users: User[];
    totalCount: number;
  };
}

interface FetchUsersParams {
  SearchTerm?: string;
  Role?: string;
  Gender?: "" | "Male" | "Female";
  PageNumber?: number;
  PageSize?: number;
}

export interface UsersState {
  usersData: User[];
  totalCount?: number;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  usersData: [],
  totalCount: 0,
  loading: false,
  error: null,
};

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/* ================= THUNK ================= */
export const fetchAdminUsers = createAsyncThunk<
  UsersResponse,
  FetchUsersParams,
  { rejectValue: string }
>(
  "users/fetchAdminUsers",
  async (
    { SearchTerm = "", Role = "", Gender = "", PageNumber, PageSize },
    { rejectWithValue },
  ) => {
    const cookieToken = Cookies.get("jwtToken");
    try {

      const searchParams = new URLSearchParams();

      if (SearchTerm) {
        searchParams.append("SearchTerm", SearchTerm);
      }
      if (Role) {
        searchParams.append("Role", Role);
      }
      if (Gender) {
        searchParams.append("Gender", Gender);
      }
      if (PageNumber) {
        searchParams.append("PageNumber", String(PageNumber));
      }
      if (PageSize) {
        searchParams.append("PageSize", String(PageSize));
      }

      const response = await fetch(`${backendUrl}Admin/users/all?${searchParams}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookieToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SearchTerm,
          Gender,
          Role,
          PageNumber,
          PageSize,
        }),
      });

      const json: UsersResponse = await response.json();
      if (!response.ok || !json.succeeded) {
        return rejectWithValue(json.message || "Request failed");
      }

      return json;
    } catch (err: any) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  },
);

/* ================= SLICE ================= */

const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // optional: reset state
    resetUsers: (state) => {
      state.usersData = [];
      state.totalCount = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersData = action.payload.data.users;
        state.totalCount = action.payload.data.totalCount;
      })

      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Error occurred";
      });
  },
});

/* ================= SELECTOR ================= */

export const selectUsers = (state: RootState) => state.usersSlice;

/* ================= EXPORT ================= */

export const { resetUsers } = UsersSlice.actions;
export default UsersSlice.reducer;
