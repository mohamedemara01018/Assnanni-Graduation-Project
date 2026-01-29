import { useState } from "react";
import { CiSearch } from "react-icons/ci";

function SearchInput({ width }: { width?: string }) {
  const [isFoucs, setFoucs] = useState(false);
  return (
    <div
      className={`border-2 border-(-color-text) rounded-lg  bg-(--color-bg) ${width} ${
        isFoucs ? "border-(--color-text-blue)" : ""
      }`}
      onFocus={() => setFoucs(true)}
      onBlur={() => setFoucs(false)}
    >
      <div className="flex items-center gap-2 p-2 w-full ">
        <label htmlFor="search">
          <CiSearch className="text-xl" />
        </label>
        <input
          id="search"
          type="text"
          className="outline-0 border-0 text-base font-medium  w-full "
          placeholder="Search..."
        />
      </div>
    </div>
  );
}

export default SearchInput;
