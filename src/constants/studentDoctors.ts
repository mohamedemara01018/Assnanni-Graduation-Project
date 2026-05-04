export type StudentDoctor = {
  id: number;
  name: string;
  university: string;
  year: string;
  supervisor: string;
  status: "Active" | "Pending Review";
  dentalUniversityProofImage: string;
};

export const studentDoctors: StudentDoctor[] = [
  {
    id: 1,
    name: "Ahmed Khaled",
    university: "Cairo Dental University",
    year: "Year 5",
    supervisor: "Dr. John Doe",
    status: "Active",
    dentalUniversityProofImage:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Mariam Ali",
    university: "Alexandria University",
    year: "Year 4",
    supervisor: "Dr. John Doe",
    status: "Pending Review",
    dentalUniversityProofImage:
      "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Youssef Hassan",
    university: "Ain Shams University",
    year: "Year 5",
    supervisor: "Dr. John Doe",
    status: "Active",
    dentalUniversityProofImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
  },
];
