import SearchInput from "@/components/search-input/SearchInput";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";

function InComingAppointments() {
  const [onFilter, setFilter] = useState(false);
  return (
    <div className="mt-6">
      <div className="w-full bg-(--color-surface) p-4 rounded-2xl ">
        <div className=" flex items-center justify-between gap-4">
          <SearchInput width="w-full" />
          <button
            onClick={() => setFilter(!onFilter)}
            className={`flex items-center gap-2 border-2 border-(--color-border) py-2 px-4 hover:bg-(--color-bg) text-(--color-text)  rounded-lg cursor-pointer ${
              onFilter ? "border-blue-500 text-(--color-text-blue)" : ""
            } `}
          >
            <CiFilter />
            Filters
          </button>
        </div>
        {onFilter && (
          <div className="flex gap-6 mt-7">
            <select
              name="status"
              id="status"
              className="block w-full  rounded-lg border border-gray-300 bg-(--color-border) px-4 py-2 pr-8 leading-tight text-(--color-text) shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-center cursor-pointer"
            >
              <option value="allStatus">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              name="type"
              id="type"
              className="block w-full  rounded-lg border border-gray-300 bg-(--color-border) px-4 py-2 pr-8 leading-tight text-(--color-text) shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-center cursor-pointer"
            >
              <option value="inPerson">In-Person</option>
              <option value="videoCall">Video Call</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default InComingAppointments;
