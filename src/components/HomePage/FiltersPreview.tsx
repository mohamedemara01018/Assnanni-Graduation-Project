import { MdChildCare } from "react-icons/md";
import { FaTooth } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";

const FiltersPreview = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 text-gray-700">
        Filters Preview
      </h1>
      <div className="flex gap-6 filterPreview max-sm:grid grid-cols-2 max-sm:gap-3">
        <div>
          <IoLocation />
          <span>Near Me</span>
        </div>
        <div>
          <FaStar />
          <span>Top Rated</span>
        </div>
        <div>
          <FaTooth />
          <span>Orthodontic</span>
        </div>
        <div>
          <MdChildCare />
          <span>Pediatric</span>
        </div>
      </div>
    </div>
  );
};

export default FiltersPreview;
