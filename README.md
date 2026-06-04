# 🦷 Asnanii - Dental Diagnoses for Periapical X-rays based on Advanced Object Detection Models

> A senior project submitted in partial fulfillment of the requirements for the degree of Bachelor of Computers and Artificial Intelligence
> **Benha University - Faculty of Computers & Artificial Intelligence**

---

## 📌 Project Overview

**Asnanii** is an innovative dental clinic management system that integrates advanced AI-powered object detection models (YOLOv7 & YOLOv8) to analyze periapical X-rays and assist dentists in diagnosing dental conditions such as caries, periapical lesions, and bone loss. The system bridges the gap between administrative efficiency and clinical accuracy, offering a comprehensive solution for dental clinics, university hospitals, and intern training environments.

---

## 🎯 Objectives

- **Digitization of Workflow** – Automate scheduling, patient records, and financial tracking
- **Enhance Diagnostic Accuracy** – AI model detects caries/infections with high sensitivity
- **Optimize Patient Flow** – Smart calendar & queue management reduce wait times
- **Support Academic Growth** – Dedicated portal for student doctors under supervision
- **Data-Driven Decisions** – Analytics for clinic performance and diagnostic outcomes

---

## 👥 User Roles

| Role               | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| **Patient**        | Book appointments, view medical history, upload X-rays, access AI reports      |
| **Doctor**         | Manage schedule, view patient records, AI-assisted diagnosis, write reports    |
| **Student Doctor** | Learn under supervision, view cases, require senior approval for modifications |
| **Receptionist**   | Queue management, walk-in bookings, payment handling                           |
| **Admin**          | Verify doctor credentials, system monitoring, audit trails                     |

---

## 🧠 AI Diagnostic Module

The system uses **YOLOv8** (chosen over YOLOv7 for superior accuracy/speed balance) to detect dental conditions from periapical X-rays.

### Performance Metrics (YOLOv8)

| Condition            | Sensitivity | Specificity |
| -------------------- | ----------- | ----------- |
| Caries (Decay)       | 91.0%       | 87.0%       |
| Periapical Lesions   | 86.6%       | 98.3%       |
| Endodontic Treatment | 93.4%       | 99.3%       |
| Calculus             | 80.2%       | 97.8%       |
| Marginal Bone Loss   | 91.1%       | 93.1%       |

---

## 🏗️ System Architecture

### Frontend

- **React.js** – Component-based UI
- **React Router** – Client-side navigation
- **Redux / Context API** – State management
- **Tailwind CSS** – Responsive styling
- **Axios** – API communication

### Backend

- **ASP.NET Core** – RESTful API services
- **JWT Authentication** – Secure role-based access
- **RBAC** – Fine-grained permissions

### AI Module

- **YOLOv8** – Object detection on X-ray images
- Containerized deployment for scalability

---

## 📊 Data Flow

User Input → Frontend (React) → Backend API ([ASP.NET](https://asp.net/)) → Validation → Database
↓
AI Module (YOLOv8)
↓
User ← Frontend ← Backend ← AI Results & Confidence Scores

---

## 🚀 Key Features

### For Patients

- Browse doctors by specialty, location, rating
- Book/cancel/reschedule appointments
- View medical history & AI diagnostic reports
- Online payment (Fawry, PayMob) + cash options
- SMS/WhatsApp reminders

### For Doctors

- Real-time dashboard with appointment schedule
- Access patient records & AI predictions
- Confirm/override AI diagnosis
- Write prescriptions & treatment plans

### For Receptionists

- Queue management with "Now Serving" display
- Walk-in booking with automatic slot suggestion
- Payment confirmation & status tracking

### For Admins

- Doctor license verification workflow
- System health monitoring
- Audit logs & analytics dashboards

---

## 🛠️ Tech Stack

| Layer           | Technology                     |
| --------------- | ------------------------------ |
| Frontend        | React.js, Tailwind CSS, Redux  |
| Backend         | ASP.NET Core                   |
| Authentication  | JWT, Role-Based Access Control |
| AI Framework    | YOLOv8 (Ultralytics)           |
| Version Control | Git & GitHub                   |
| IDE             | VS Code                        |

---

## 📈 Challenges & Solutions

| Challenge              | Solution                                       |
| ---------------------- | ---------------------------------------------- |
| Evolving requirements  | Modular architecture with independent features |
| Multi-role complexity  | RBAC with role-based UI rendering              |
| Real-time queue sync   | Backend as single source of truth              |
| AI integration latency | Containerized AI module with async processing  |
| Data security          | HTTPS, JWT, encryption, audit logging          |

---

## 🔮 Future Work

- Expand AI coverage to more dental diseases
- Full clinic management system integration
- Predictive analytics for patient flow
- Tele-dentistry support
- Mobile application (Flutter)
- Multi-clinic / multi-branch support

---

## 👨‍💻 Project Team

| Name                    |
| ----------------------- |
| Zaid Ibrahim Saleh      |
| Ziad Yasser Abtelmaget  |
| Kerolos Soliman Helmy   |
| Mohamed Ahmed Amer      |
| Yousef Khaled El Shahat |
| Yousef Abdallah Orabi   |
| Mohamed Gamal           |

**Under Supervision of:**
Dr. Ahmed Yousry
Eng. Esraa Taher

---

## 📄 License

This project is submitted as a graduation requirement for the Bachelor of Computers and Artificial Intelligence, Benha University.

---

## 🔗 Repository

[github.com/mohamedemara01018/Assnanni-Graduation-Project](https://github.com/mohamedemara01018/Assnanni-Graduation-Project)

---

## 📚 References

Main sources include research on AI in dental radiology (Pearl, Overjet), YOLO architecture papers, and dental epidemiology studies in Egypt. Full reference list available in the project document.

---

<div align="center">
  <sub>Built with ❤️ for better dental care • Benha University • Class of 2026</sub>
</div>
