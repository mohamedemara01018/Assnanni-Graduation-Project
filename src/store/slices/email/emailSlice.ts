import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: {
    emailAddress: localStorage.getItem("userEmail") || null, // Initialize from storage
  },
  reducers: {
    // This is the action you'll call after Axios finishes
    getEmail: (state, action) => {
      state.emailAddress = action.payload;
      // Optional: Persist to localStorage so it survives a refresh
      localStorage.setItem("userEmail", action.payload);
    },
  },
});

export const { getEmail } = emailSlice.actions;
export default emailSlice.reducer;
