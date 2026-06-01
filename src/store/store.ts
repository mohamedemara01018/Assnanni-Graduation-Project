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
import availableDatesReducer from './slices/patient-slice/available-dates-slice/availableDatesSlice'
import availableSlotsReducer from './slices/patient-slice/available-slots-slice/availableSlotsSlice'
import allAppointmentsReducer from './slices/patient-slice/all-appointments-slice/allAppointmentsSlice'
import appointmentDetailsReducer from './slices/patient-slice/appintment-details-slice/appointmentDetailsSlice'
import doctorBookingDetailsReducer from './slices/patient-slice/doctor-booking-details-slice/doctorBookingDetailsSlice'
import bookAppointmentReducer from './slices/patient-slice/book-appointment-slice/bookAppointmentSlice'
import rescheduleAppointmentReducer from './slices/patient-slice/reschedule-appointment-slice/rescheduleAppointmentSlice'
import cancelAppointmentReducer from './slices/patient-slice/cancel-appointment-slice/cancelAppointmentSlice'

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
    availableDatesSlice: availableDatesReducer,
    availableSlotsSlice: availableSlotsReducer,
    allAppointmentsSlice: allAppointmentsReducer,
    appointmentDetailsSlice: appointmentDetailsReducer,
    doctorBookingDetailsSlice: doctorBookingDetailsReducer,
    bookAppointmentSlice: bookAppointmentReducer,
    rescheduleAppointmentSlice: rescheduleAppointmentReducer,
    cancelAppointmentSlice: cancelAppointmentReducer
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
