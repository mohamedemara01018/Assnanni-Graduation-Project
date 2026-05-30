import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import emailReducer from "./slices/email/emailSlice";
import configReducer from "./slices/config/configSlice";
import summaryReducer from './slices/admin-slice/summary-slice/SummarySlice'
import usersReducer from './slices/admin-slice/users-slice/UsersSlice'
import pendingDoctorReducer from './slices/admin-slice/pending-doctor-slice/pendingDoctorSlice'
import searchPendingDoctorReducer from './slices/admin-slice/search-pending-doctors-slice/searchPendingDoctorSlice'
import approvePendingDoctorReducer from './slices/admin-slice/approve-pending-doctor-slice/approvePendingDoctorSlice'
import rejectPendingDoctorReducer from './slices/admin-slice/reject-pending-doctor-slice/rejectPendingDoctorSlice'
import patientDashboardReducer from './slices/patient-slice/patient-dashboard-slice/patientDashboardSlice'
import allDoctorsReducer from './slices/patient-slice/all-doctors.slice/allDoctorsSlice'
import doctorProfileReducer from './slices/patient-slice/doctor-profile-slice/doctorProfileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    config: configReducer,

    // admin dashboard
    summarySlice: summaryReducer,
    usersSlice: usersReducer,
    pendingDoctorsSlice: pendingDoctorReducer,
    searchPendingDoctorSlice: searchPendingDoctorReducer,
    approvePendingDoctorSlice: approvePendingDoctorReducer,
    rejectPendingDoctorSlice: rejectPendingDoctorReducer,


    // patient dashoard
    patientDashboardSlice: patientDashboardReducer,
    allDoctorsSlice: allDoctorsReducer,
    doctorProfileSlice: doctorProfileReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
