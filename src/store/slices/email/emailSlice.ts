import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const emailSlice = createSlice({
  name: "email",
  initialState: {
    emailAddress: Cookies.get("userEmail") || null,
  },
  reducers: {
    getEmail: (state, action) => {
      state.emailAddress = action.payload;
      Cookies.set("userEmail", action.payload, { expires: 1 });
    },
    clearEmail: (state) => {
      state.emailAddress = null;
      Cookies.remove("userEmail");
    },
  },
});

export const { getEmail, clearEmail } = emailSlice.actions;
export default emailSlice.reducer;
