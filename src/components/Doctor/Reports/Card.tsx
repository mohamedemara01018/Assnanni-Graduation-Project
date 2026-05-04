import { FiFileText, FiDownload, FiFile, FiTable } from "react-icons/fi";

interface Props {
  title: string;
  date: string;
  size: string;
  type: "PDF" | "Excel" | "File";
  fileUrl?: string;
}

const Card = ({ title, date, size, type, fileUrl }: Props) => {
  const getIcon = () => {
    switch (type) {
      case "PDF":
        return <FiFileText className="text-xl text-blue-600" />;
      case "Excel":
        return <FiTable className="text-xl text-green-600" />;
      default:
        return <FiFile className="text-xl text-gray-600" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "PDF":
        return "bg-blue-50";
      case "Excel":
        return "bg-green-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200 cursor-pointer mb-3 last:mb-0 group">
      <div className="flex gap-4 items-center">
        <div className={`${getIconBg()} p-3 rounded-lg`}>
          {getIcon()}
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {date} <span className="mx-1">•</span> {size}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
          {type}
        </span>
        {fileUrl ? (
          <a 
            href={fileUrl}
            download
            title="Download Report"
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <FiDownload className="text-lg" />
          </a>
        ) : (
          <button 
            title="Download Report"
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Downloading ${title}...`);
            }}
          >
            <FiDownload className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
