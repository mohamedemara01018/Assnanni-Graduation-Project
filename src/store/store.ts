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
import allDoctorsReducer from './slices/patient-slice/all-doctors-slice/allDoctorsSlice'
import doctorProfileReducer from './slices/patient-slice/doctor-profile-slice/doctorProfileSlice'
import availableDatesReducer from './slices/patient-slice/available-dates-slice/availableDatesSlice'
import availableSlotsReducer from './slices/patient-slice/available-slots-slice/availableSlotsSlice'
import allAppointmentsReducer from './slices/patient-slice/all-appointments-slice/allAppointmentsSlice'
import appointmentDetailsReducer from './slices/patient-slice/appintment-details-slice/appointmentDetailsSlice'
import doctorBookingDetailsReducer from './slices/patient-slice/doctor-booking-details-slice/doctorBookingDetailsSlice'
import bookAppointmentReducer from './slices/patient-slice/book-appointment-slice/bookAppointmentSlice'
import rescheduleAppointmentReducer from './slices/patient-slice/reschedule-appointment-slice/rescheduleAppointmentSlice'
import cancelAppointmentReducer from './slices/patient-slice/cancel-appointment-slice/cancelAppointmentSlice'
import prescriptionsReducer from './slices/patient-slice/prescriptions-slice/prescriptionsSlice';
import myFeedbacksReducer from './slices/patient-slice/my-feedbacks-slice/myFeedbacksSlice'
import myDoctorsReducer from './slices/patient-slice/my-doctors-slice/myDoctorsSlice';
import spectializationsReducer from './slices/patient-slice/specializations-slice/specializationsSlice';
import addFeedbackReducer from './slices/patient-slice/add-feedback-slice/addFeedbackSlice';
import editFeedbackReducer from './slices/patient-slice/edit-feedback-slice/editFeedbackSlice';
import deleteFeedbackReducer from './slices/patient-slice/delete-feedback-slice/deleteFeedbackSlice'
import medicalHistoryReducer from './slices/patient-slice/medical-history-slice/medicalHistorySlice'
import rejectedDoctorsReducer from './slices/admin-slice/rejected-doctors-slice/rejectedDoctorsSlic'
import verifiedDoctorsReducer from './slices/admin-slice/verified-doctors-slice/verifiedDoctorSlice';
import toggleStatusUsersReducer from './slices/admin-slice/toggle-status-users-slice/toggleStatusUsersSlice';
import createPaymentReducer from './slices/patient-slice/create-payment-slice/createPaymentSlice';
import adminDashboardReducer from './slices/admin-slice/admin-dashboard-slice/adminDashboardSlice'
import aiModelsReducer from './slices/admin-slice/ai-model-slice/aiModelsSlice'
import singleModelReducer from './slices/admin-slice/single-model-slice/singleModelSlice';
import updateAIModelReducer from './slices/admin-slice/update-aI-model-slice/updateAIModelSlice'
import deleteAIModelReducer from './slices/admin-slice/delete-aI-model-slice/deleteAIModelSlice'
import createModelReducer from './slices/admin-slice/create-ai-model-slice/createAIModelSlice'
import favoriteDoctorsReducer from './slices/patient-slice/favorites-slice/favoritesSlice'
import deleteFavoriteReducer from './slices/patient-slice/remove-doctor-from-favorites-slice/removeDoctorFromFavoritesSlice'
import addFavoriteReducer from './slices/patient-slice/add-doctor-to-favorites-slice/addDoctorToFavoritesSlice';
import verifyDoctorReducer from './slices/admin-slice/verify-doctor-account-slice/verifyDoctorAccountSlice';
import rejectDoctorReducer from './slices/admin-slice/reject-doctor-account-slice/rejectDoctorAccountSlice';
import analyticsDashboardReducer from './slices/admin-slice/analtics-dashboard-slice/analticsDashboardSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    config: configReducer,

    // admin dashboard
    adminDashboardSlice: adminDashboardReducer,
    summarySlice: summaryReducer,
    usersSlice: usersReducer,
    pendingDoctorsSlice: pendingDoctorReducer,
    searchPendingDoctorSlice: searchPendingDoctorReducer,
    approvePendingDoctorSlice: approvePendingDoctorReducer,
    rejectPendingDoctorSlice: rejectPendingDoctorReducer,
    rejectedDoctorsSlice: rejectedDoctorsReducer,
    verifiedDoctorsSlice: verifiedDoctorsReducer,
    toggleStatusUsersSlice: toggleStatusUsersReducer,
    aiModelsSlice: aiModelsReducer,
    singleModelSlice: singleModelReducer,
    updateAIModelSlice: updateAIModelReducer,
    deleteAIModelSlice: deleteAIModelReducer,
    createModelSlice: createModelReducer,
    verifyDoctorSlice: verifyDoctorReducer,
    rejectDoctorSlice: rejectDoctorReducer,
    analyticsDashboardSlice: analyticsDashboardReducer,


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
    cancelAppointmentSlice: cancelAppointmentReducer,
    prescriptionsSlice: prescriptionsReducer,
    myFeedbacksSlice: myFeedbacksReducer,
    myDoctorsSlice: myDoctorsReducer,
    spectializationsSlice: spectializationsReducer,
    addFeedbackSlice: addFeedbackReducer,
    editFeedbackSlice: editFeedbackReducer,
    deleteFeedbackSlice: deleteFeedbackReducer,
    medicalHistorySlice: medicalHistoryReducer,
    createPaymentSlice: createPaymentReducer,
    favoriteDoctorsSlice: favoriteDoctorsReducer,
    deleteFavoriteSlice: deleteFavoriteReducer,
    addFavoriteSlice: addFavoriteReducer
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
