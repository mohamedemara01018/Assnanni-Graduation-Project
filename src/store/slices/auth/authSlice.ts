import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { clearAllCookies } from "@/utils/cookieUtils";

interface AuthState {
  token: string | null;
  id: string | null;
  role: string;
  name: string | null;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  expiresAt: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
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
  if (tokenExpirationDate && tokenExpirationDate.getTime() <= Date.now()) {
    clearAllCookies();
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

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as {
        auth: AuthState;
        config: { backendUrl: string };
      };
      const response = await axios.get(
        `${state.config.backendUrl}Users/my-profile`,
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        },
      );
      const profile = response.data.data;
      Cookies.set("userProfile", JSON.stringify(profile), {
        expires: state.auth.expiresAt ? new Date(state.auth.expiresAt) : 7,
      });
      return profile;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

const getInitialAuth = () => {
  const token = Cookies.get("jwtToken");
  const profileCookie = Cookies.get("userProfile");
  const profile = profileCookie ? JSON.parse(profileCookie) : null;

  if (token) {
    try {
      const auth = getAuthFromToken(token);
      return {
        ...auth,
        fullName: profile?.fullName || null,
        phoneNumber: profile?.phoneNumber || null,
        profileImageUrl: profile?.profileImageUrl || null,
      };
    } catch (e) {
      return {
        id: null,
        role: "guest",
        name: null,
        fullName: null,
        email: null,
        phoneNumber: null,
        profileImageUrl: null,
        expiresAt: null,
      };
    }
  }
  return {
    id: null,
    role: "guest",
    name: null,
    fullName: null,
    email: null,
    phoneNumber: null,
    profileImageUrl: null,
    expiresAt: null,
  };
};

const initialAuth = getInitialAuth();
const initialState: AuthState = {
  token: Cookies.get("jwtToken") || null,
  id: initialAuth.id,
  role: initialAuth.role,
  name: initialAuth.name,
  fullName: initialAuth.fullName,
  email: initialAuth.email,
  phoneNumber: initialAuth.phoneNumber,
  profileImageUrl: initialAuth.profileImageUrl,
  expiresAt: initialAuth.expiresAt,
  status: "idle",
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
        state.fullName = null;
        state.email = null;
        state.expiresAt = null;

        Cookies.remove("_stripe_mid");
        Cookies.remove("_stripe_sid");
        Cookies.remove("cid");
        Cookies.remove("docs.prefs");
        Cookies.remove("machine_identifier");
        Cookies.remove("private_machine_identifier");
        Cookies.remove("recent-views");
        clearAllCookies();
      }
    },
    logout: (state) => {
      state.token = null;
      state.id = null;
      state.role = "guest";
      state.name = null;
      state.fullName = null;
      state.email = null;
      state.phoneNumber = null;
      state.profileImageUrl = null;
      state.expiresAt = null;
      clearAllCookies();
      Cookies.remove("_stripe_mid");
      Cookies.remove("_stripe_sid");
      Cookies.remove("cid");
      Cookies.remove("docs.prefs");
      Cookies.remove("machine_identifier");
      Cookies.remove("private_machine_identifier");
      Cookies.remove("recent-views");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fullName = action.payload.fullName;
        state.phoneNumber = action.payload.phoneNumber;
        state.profileImageUrl = action.payload.profileImageUrl;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
