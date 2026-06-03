// Route path configurations by role
export const roleRoutePaths = {
  admin: [
    "/admin",
    "users",
    "add-user",
    "verify-doctors",
    "analytics",
    "ai-models",
  ],
  doctor: [
    "/doctor",
    "add-time-slot",
    "doctor-patients/:id/medical-history/add",
    "doctor-reports",
    "/doctor-profile/:id",
    "/doctor-profile/edit/:id",
    "doctor-supervisioning",
    "doctor-supervisioning/view-request/:id",
    "doctor-supervisioning/assign-student-doctor/:id",
    "doctor-reports/generate-new-report",
    "doctor-reports/all",
    "receptionist-access",
    "receptionist-access/add",
    "scan/upload",
    "scan/analysis/:scanId",
    "doctor-learning-sessions",
    "doctor-learning-sessions/create",
    "doctor-learning-sessions/:id",
    "doctor/student-record-approvals",
  ],
  studentDoctor: [
    "/student-doctor",
    "student-notification",
    "contact-supervisor",
    "student-doctor/create-medical-record/:id",
    "student-doctor/medical-record-drafts",
    "student-doctor/training-sessions",
    "student-doctor/medical-record-drafts/:draftId",
    "student-doctor/medical-record-drafts/update/:draftId",
  ],
  receptionist: [
    "/receptionist",
    "/receptionist/schedule-appointment",
    "/receptionist/:id/check-in",
    "/receptionist/reschedule/:id",
    "/receptionist/register-patient",
  ],
  patient: [
    "/patient",
    "patient-profile",
    "patient-profile/edit",
    "appointments",
    "prescriptions",
    "medical-history"
  ],
};

// Shared route configurations (accessible by multiple roles)
export const sharedRoutePaths = [
  {
    path: "settings",
    allowedRoles: [
      "doctor",
      "patient",
      "receptionist",
      "studentDoctor",
      "admin",
    ],
    children: ["", "security", "notifications"],
  },
  {
    path: "notification",
    allowedRoles: [
      "doctor",
      "patient",
      "receptionist",
      "studentDoctor",
      "admin",
    ],
  },
  {
    path: "profile",
    allowedRoles: [
      "doctor",
      "patient",
      "receptionist",
      "studentDoctor",
      "admin",
    ],
  },
  {
    path: "student-settings",
    allowedRoles: ["studentDoctor"],
    children: ["", "security", "notifications"],
  },

  {
    path: "doctor-appointments",
    allowedRoles: ["receptionist", "studentDoctor"],
  },
  // from here
  {
    path: "doctor-appointments/:id",
    allowedRoles: ["receptionist", "studentDoctor"],
  },
  {
    path: "doctor-schedule",
    allowedRoles: ["doctor", "studentDoctor", "receptionist"],
  },

  {
    path: "doctor-patients",
    allowedRoles: ["doctor", "receptionist"],
  },
  {
    path: "doctor-patients/:id",
    allowedRoles: ["doctor", "receptionist"],
  },
  {
    path: "doctor-patients/:id/medical-history",
    allowedRoles: ["doctor", "receptionist"],
  },
  {
    path: "medical-history",
    allowedRoles: ["doctor", "patient"],
  },
  {
    path: 'my-feedbacks',
    allowedRoles: ["patient"],
  },
  {
    path: 'my-doctors',
    allowedRoles: ["patient"],
  }
];

// Public route paths (accessible without authentication)
export const publicRoutePaths = [
  "/appointments",
  "/doctors-list",
  "/doctors-list/:id",
  "/appointments/booking/:id",

  "/patient-profile/:id",
  "/patient-profile/edit/:id",
];
