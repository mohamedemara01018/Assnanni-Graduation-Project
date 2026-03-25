import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    role: localStorage.getItem("userRole") || "guest", // Initialize from storage
  },
  reducers: {
    // This is the action you'll call after Axios finishes
    updateRole: (state, action) => {
      state.role = action.payload;
      // Optional: Persist to localStorage so it survives a refresh
      localStorage.setItem("userRole", action.payload);
    },
    logout: (state) => {
      state.role = "guest";
      localStorage.removeItem("userRole");
    },
  },
});

export const { updateRole, logout } = authSlice.actions;
export default authSlice.reducer;
