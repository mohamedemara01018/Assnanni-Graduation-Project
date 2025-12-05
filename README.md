# Assnani

Assnani is a comprehensive healthcare web application that allows **patients, doctors, student doctors, and receptionists** to manage appointments, verify credentials, and handle medical processes efficiently.

---

## Features

- **User Roles:** Patients, Doctors, Student Doctors, Receptionists  
- **Authentication:** Users can register and log in  
- **Email Verification:** After registration, users are redirected to email verification  
- **Doctor Verification:** Doctors and student doctors must submit proof of their credentials and clinic information  
- **Appointment Booking:** Patients can book appointments with verified doctors  
- **Receptionist Dashboard:** Receptionists manage patient data and forward it to doctors  
- **Medical Process Workflow:**  
  - Doctors request medical scans (e.g., X-rays) from patients  
  - Doctors upload scan results to the system  
  - System generates outputs based on the uploaded scans  

---

## Workflow

1. **Registration & Login**  
   - Patients, Doctors, Student Doctors, and Receptionists can register and log in.  

2. **Email Verification**  
   - After registration, users are redirected to the email verification page.  

3. **Doctor Verification**  
   - Doctors and Student Doctors must provide credentials and clinic information to verify their identity.  

4. **Appointment Booking**  
   - Patients select a doctor and book an appointment.  

5. **Receptionist Processing**  
   - Receptionists collect patient data and send it to the doctor.  

6. **Medical Scan & Output**  
   - Doctors request scans from patients.  
   - Doctors upload the scan results to the system.  
   - The system generates the final medical output for the patient.  

---

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication & Authorization:** JWT, Firebase (optional)  
- **Components:** Shadcn/UI for reusable components  

---

## Installation

1. Clone the repo:  
```bash
git clone https://github.com/your-username/assnani.git
