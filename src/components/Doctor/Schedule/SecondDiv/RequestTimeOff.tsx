const RequestTimeOff = () => {
  return (
    <div className="flex flex-col gap-4 bg-(--color-surface) p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <h3 className="text-lg font-medium text-(--color-text)">
        Time Off Requests
      </h3>
      <button className="w-full border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-sm font-medium text-(--color-text) hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
        Request Time Off
      </button>
    </div>
  );
};

export default RequestTimeOff;
