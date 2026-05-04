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
    "doctor-supervisioning",
    "doctor-supervisioning/view-request/:id",
    "doctor-supervisioning/assign-student-doctor/:id",
    "doctor-reports/generate-new-report",
    "receptionist-access",
    "receptionist-access/add",
    "scan/upload",
  ],
  studentDoctor: [
    "/student-doctor",
    "student-notification",
    "contact-supervisor",
  ],
  receptionist: [
    "/receptionist",
    "/receptionist/schedule-appointment",
    "/receptionist/check-in",
    "/receptionist/reschedule/:id",
  ],
  patient: [
    "/patient",
    "patient-profile",
    "patient-profile/edit",
    "appointments",
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
    allowedRoles: ["doctor", "patient", "receptionist", "studentDoctor"],
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
