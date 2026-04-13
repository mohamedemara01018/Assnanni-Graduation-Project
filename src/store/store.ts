import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/auth/authSlice'
import emailReducer from './slices/email/emailSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
