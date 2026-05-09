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
    <div className="flex justify-between items-center bg-(--color-bg) hover:bg-(--color-bg-link-hover) p-4 rounded-xl transition-colors duration-200 cursor-pointer mb-3 last:mb-0 group border border-(--color-border)">
      <div className="flex gap-4 items-center">
        <div className={`${getIconBg()} p-3 rounded-lg`}>
          {getIcon()}
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-(--color-text)">{title}</h3>
          <p className="text-xs text-(--color-text-light) font-medium">
            {date} <span className="mx-1 text-(--color-border)">•</span> {size}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="bg-(--color-surface) text-(--color-text-light) border border-(--color-border) text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
          {type}
        </span>
        {fileUrl ? (
          <a 
            href={fileUrl}
            download
            title="Download Report"
            className="p-2 text-(--color-text-light) hover:text-(--color-primary) hover:bg-(--color-primary-lighter)/20 rounded-lg transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <FiDownload className="text-lg" />
          </a>
        ) : (
          <button 
            title="Download Report"
            className="p-2 text-(--color-text-light) hover:text-(--color-primary) hover:bg-(--color-primary-lighter)/20 rounded-lg transition-all duration-200"
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
