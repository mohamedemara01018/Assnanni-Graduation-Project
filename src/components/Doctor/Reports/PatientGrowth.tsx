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
  type ChartOptions,
} from "chart.js";

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

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Patient Growth",
      data: [20, 30, 25, 40, 60, 65, 70], // The Y-values
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.4, // Smooths the line
    },
  ],
};

// 2. Define the chart options (optional, for customization)
const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top", // Position the legend at the top
    },
    title: {
      display: true,
      text: "Patients Growth Analytics", // Chart title
    },
  },

  scales: {
    x: {
      title: {
        display: true,
        text: "Month",
      },
    },
    y: {
      title: {
        display: true,
        text: "Value",
      },
      min: 0,
      max: 100,
    },
  },
};
const PatientGrowth = () => {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-full">
      <h2 className="mb-6 text-lg font-bold text-gray-900">
        Patient Growth
      </h2>
      <div className="h-[300px] flex items-center justify-center">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PatientGrowth;
