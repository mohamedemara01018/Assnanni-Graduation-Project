import { FiUsers, FiCalendar, FiFileText, FiDollarSign, FiTrendingUp } from "react-icons/fi";

const statCards = [
  {
    title: "Total Patients",
    value: "1,234",
    change: "+12.5%",
    icon: <FiUsers className="text-blue-600 text-xl" />,
    iconBg: "bg-blue-50",
    trend: "up",
  },
  {
    title: "Appointments",
    value: "856",
    change: "+8.3%",
    icon: <FiCalendar className="text-green-600 text-xl" />,
    iconBg: "bg-green-50",
    trend: "up",
  },
  {
    title: "Scans Processed",
    value: "2,891",
    change: "+15.7%",
    icon: <FiFileText className="text-purple-600 text-xl" />,
    iconBg: "bg-purple-50",
    trend: "up",
  },
  {
    title: "Revenue",
    value: "$45,230",
    change: "+23.1%",
    icon: <FiDollarSign className="text-orange-600 text-xl" />,
    iconBg: "bg-orange-50",
    trend: "up",
  },
];

const Insights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`${card.iconBg} p-3 rounded-xl`}>
              {card.icon}
            </div>
            <div className="flex items-center gap-1 text-green-500 font-medium text-sm">
              <FiTrendingUp />
              <span>{card.change}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Insights;
