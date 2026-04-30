import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: {
    emailAddress: localStorage.getItem("userEmail") || null,
  },
  reducers: {
    getEmail: (state, action) => {
      state.emailAddress = action.payload;
      localStorage.setItem("userEmail", action.payload);
    },
    clearEmail: () => {
      localStorage.removeItem("userEmail");
    },
  },
});

export const { getEmail, clearEmail } = emailSlice.actions;
export default emailSlice.reducer;
