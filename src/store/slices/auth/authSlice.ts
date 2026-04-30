/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  role: string;
}

const getInitialRole = () => {
  const token = Cookies.get("jwtToken");
  if (token) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(token);
      return decoded.role || "guest";
    } catch (e) {
      return "guest";
    }
  }
  return "guest";
};

const initialState: AuthState = {
  token: Cookies.get("jwtToken") || null,
  role: getInitialRole(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const token = action.payload;
      state.token = token;
      Cookies.set("jwtToken", token, { expires: 7 }); // expires in 7 days
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(token);
        state.role = decoded.role || "guest";
      } catch (e) {
        state.role = "guest";
      }
    },
    logout: (state) => {
      state.token = null;
      state.role = "guest";
      Cookies.remove("jwtToken");
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
