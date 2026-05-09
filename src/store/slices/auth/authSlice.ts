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
  expiresAt: number | null;
}

const claimKeyPrefixes = [
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/",
];

const normalizeTokenClaims = (decoded: Record<string, unknown>) =>
  Object.entries(decoded).reduce<Record<string, unknown>>(
    (claims, [key, value]) => {
      const prefix = claimKeyPrefixes.find((claimPrefix) =>
        key.startsWith(claimPrefix),
      );
      const normalizedKey = prefix ? key.replace(prefix, "") : key;

      claims[normalizedKey] = value;

      return claims;
    },
    {},
  );

const getTokenExpirationDate = (exp: unknown) => {
  const expSeconds = typeof exp === "number" ? exp : Number(exp);

  if (!Number.isFinite(expSeconds)) {
    return null;
  }

  return new Date(expSeconds * 1000);
};

const getAuthFromToken = (token: string) => {
  const decoded = normalizeTokenClaims(
    jwtDecode<Record<string, unknown>>(token),
  );
  const tokenExpirationDate = getTokenExpirationDate(decoded.exp);
  console.log(decoded);
  if (tokenExpirationDate && tokenExpirationDate.getTime() <= Date.now()) {
    Cookies.remove("jwtToken");
    throw new Error("Token expired");
  }

  decoded.role = (decoded.role as string)?.toLowerCase();
  decoded.role =
    (decoded.role === "studentdoctor" && "studentDoctor") || decoded.role;
  return {
    id: (decoded.sub as string) || (decoded.nameidentifier as string) || null,
    role: (decoded.role as string) || "guest",
    name: (decoded.name as string) || (decoded.unique_name as string) || null,
    email: (decoded.email as string) || null,
    expiresAt: tokenExpirationDate?.getTime() || null,
  };
};

const getInitialAuth = () => {
  const token = Cookies.get("jwtToken");
  if (token) {
    try {
      return getAuthFromToken(token);
    } catch (e) {
      return {
        id: null,
        role: "guest",
        name: null,
        email: null,
        expiresAt: null,
      };
    }
  }
  return {
    id: null,
    role: "guest",
    name: null,
    email: null,
    expiresAt: null,
  };
};

const initialAuth = getInitialAuth();
const initialState: AuthState = {
  token: Cookies.get("jwtToken") || null,
  id: initialAuth.id,
  role: initialAuth.role,
  name: initialAuth.name,
  email: initialAuth.email,
  expiresAt: initialAuth.expiresAt,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const token = action.payload;
      state.token = token;
      try {
        const auth = getAuthFromToken(token);
        const cookieOptions = auth.expiresAt
          ? { expires: new Date(auth.expiresAt) }
          : undefined;

        Cookies.set("jwtToken", token, cookieOptions);
        state.id = auth.id;
        state.role = auth.role;
        state.name = auth.name;
        state.email = auth.email;
        state.expiresAt = auth.expiresAt;
      } catch (e) {
        state.token = null;
        state.id = null;
        state.role = "guest";
        state.name = null;
        state.email = null;
        state.expiresAt = null;
        Cookies.remove("jwtToken");
      }
    },
    logout: (state) => {
      state.token = null;
      state.id = null;
      state.role = "guest";
      state.name = null;
      state.email = null;
      state.expiresAt = null;
      Cookies.remove("jwtToken");
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
