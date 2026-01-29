import { useState } from "react";
import { CiSearch } from "react-icons/ci";

function SearchInput() {
  const [isFoucs, setFoucs] = useState(false);
  return (
    <div
      className={`border-2 border-(-color-text) rounded-lg  bg-(--color-bg) ${
        isFoucs ? "border-(--color-text-blue)" : ""
      }`}
      onFocus={() => setFoucs(true)}
      onBlur={() => setFoucs(false)}
    >
      <div className="flex items-center gap-2 p-2">
        <label htmlFor="search">
          <CiSearch className="text-xl text-(--color-text)" />
        </label>
        <input
          id="search"
          type="text"
          className="outline-0 border-0 text-base font-medium  text-(--color-text) "
          placeholder="Search..."
        />
      </div>
    </div>
  );
}

export default SearchInput;
