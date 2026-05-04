import { createSlice } from "@reduxjs/toolkit";

interface ConfigState {
  backendUrl: string;
}

const initialState: ConfigState = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || "https://asnani.runasp.net/api/",
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},
});

export default configSlice.reducer;
