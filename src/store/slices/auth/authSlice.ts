/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  id: string | null;
  role: string;
  name: string | null;
  email: string | null;
}

const getInitialAuth = () => {
  const token = Cookies.get("jwtToken");
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.id || null,
        role: decoded.role || "guest",
        name: decoded.name || null,
        email: decoded.email || null,
      };
    } catch (e) {
      return {
        id: null,
        role: "guest",
        name: null,
        email: null,
      };
    }
  }
  return {
    id: null,
    role: "guest",
    name: null,
    email: null,
  };
};

const initialAuth = getInitialAuth();
const initialState: AuthState = {
  token: Cookies.get("jwtToken") || null,
  id: initialAuth.id,
  role: initialAuth.role,
  name: initialAuth.name,
  email: initialAuth.email,
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
        state.id = decoded.id || null;
        state.role = decoded.role || "guest";
        state.name = decoded.name || null;
        state.email = decoded.email || null;
      } catch (e) {
        state.id = null;
        state.role = "guest";
        state.name = null;
        state.email = null;
      }
    },
    logout: (state) => {
      state.token = null;
      state.id = null;
      state.role = "guest";
      state.name = null;
      state.email = null;
      Cookies.remove("jwtToken");
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
