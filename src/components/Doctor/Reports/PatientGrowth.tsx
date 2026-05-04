import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { data, options } from "@/constants/doctorConstants";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PatientGrowth = () => {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-full">
      <h2 className="mb-6 text-lg font-bold text-gray-900">Patient Growth</h2>
      <div className="h-[300px] flex items-center justify-center">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PatientGrowth;
