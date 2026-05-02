import Card from "./Card";
import { FaRegClock } from "react-icons/fa6";
import { LuFileSpreadsheet } from "react-icons/lu";
import { NavLink } from "react-router";
import Patient from "./Patient";
import { CiLock } from "react-icons/ci";

const dummyPatients = [
  {
    id: 1,
    name: "John Doe",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    lastInteractionDate: "2026-04-30",
  },
  {
    id: 2,
    name: "Mary Smith",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    lastInteractionDate: "2026-04-29",
  },
  {
    id: 3,
    name: "Robert Brown",
    imageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    lastInteractionDate: "2026-04-28",
  },
];

interface Observation {
  id: number;
  doctorName: string;
  specialty: string;
  time: string;
  supervisor: string;
  status: string;
}

const dummyObservations: Observation[] = [
  {
    id: 1,
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    time: "10:00",
    supervisor: "Dr. Smith",
    status: "Observe Only",
  },
  {
    id: 2,
    doctorName: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    time: "14:00",
    supervisor: "Dr. Miller",
    status: "Observe Only",
  },
];

interface Scan {
  id: number;
  type: string;
  caseStudyNum: string;
  note: string;
  status: string;
}

const dummyScans: Scan[] = [
  {
    id: 1,
    type: "CT Scan",
    caseStudyNum: "#",
    note: "For educational purposes only",
    status: "View & Learn",
  },
];

const FirstDiv = () => {
  return (
    <div className="flex-2">
      <div className="bg-(--color-surface) p-6 rounded-xl shadow-sm border border-(--color-border)">
        <div className="flex justify-between mb-6 pb-3 border-b border-(--color-border) items-center">
          <h1 className="text-xl flex items-center gap-2 text-(--color-text) font-medium">
            Today's Observations
            <span className="text-xs font-normal text-(--color-text-light) max-sm:hidden">
              {" "}
              (Supervised)
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
          {dummyObservations.map((obs) => (
            <Card
              key={obs.id}
              title={`Observation: ${obs.doctorName}`}
              status={obs.status}
              color="blue"
              logo={<FaRegClock />}
            >
              <p>{obs.specialty}</p>
              <p>
                {obs.time} • Supervisor: {obs.supervisor}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-(--color-surface) p-6 rounded-xl mt-6 shadow-sm border border-(--color-border)">
        <div className="flex justify-between mb-6 pb-3 border-b border-(--color-border) items-center">
          <h1 className="text-xl text-(--color-text) font-medium">
            Scans for Learning
            <span className="text-xs ml-2 font-normal text-(--color-text-light) max-sm:hidden">
              (Educational Access)
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-1">
          {dummyScans.map((scan) => (
            <Card
              key={scan.id}
              title={scan.type}
              status={scan.status}
              color="violet"
              logo={<LuFileSpreadsheet />}
            >
              <p>Case Study {scan.caseStudyNum}</p>
              <p>{scan.note}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-(--color-surface) p-6 rounded-xl mt-6 shadow-sm border border-(--color-border)">
        <div className="flex justify-between mb-6 pb-3 border-b border-(--color-border) items-center">
          <h1 className="text-xl text-(--color-text) font-medium flex gap-2 items-center">
            Patient Cases <CiLock className="text-(--color-text-light) " />
          </h1>
          <NavLink
            to={"#"}
            className={"text-sm text-(--color-text-light) cursor-text"}
          >
            View Only
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
          {dummyPatients.map((patient) => (
            <Patient
              key={patient.id}
              id={patient.id}
              name={patient.name}
              imageUrl={patient.imageUrl}
              lastInteractionDate={patient.lastInteractionDate}
            />
          ))}
        </div>
        <p className="bg-blue-50 text-blue-600 text-[10px] px-4 py-2 mt-6 rounded-lg border border-blue-100 flex items-center gap-2">
          <span>🔒</span> Full patient records require supervisor authorization
        </p>
      </div>
    </div>
  );
};

export default FirstDiv;
