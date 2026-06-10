import { useState, type Dispatch, type SetStateAction } from "react";
import { CiSearch } from "react-icons/ci";

interface SearchInputProps {
  style?: string;
  placeholder?: string;
  padding?: string;
  setSearch?: Dispatch<SetStateAction<string>>;
}

function SearchInput({
  style,
  placeholder = "Search...",
  padding = "p-2",
  setSearch,
}: SearchInputProps) {
  const [isFocus, setFocus] = useState(false);

  return (
    <div
      className={`border-2 border-(--color-text) rounded-lg bg-(--color-bg) ${style} ${
        isFocus ? "border-(--color-text-blue)" : ""
      }`}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      <div className={`flex items-center gap-2 ${padding} w-full`}>
        <label htmlFor="search">
          <CiSearch className="text-xl max-sm:text-md" />
        </label>

        <input
          id="search"
          type="text"
          placeholder={placeholder}
          className="outline-none border-none text-base font-medium w-full max-sm:text-sm"
          onChange={(e) => setSearch?.(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchInput;
