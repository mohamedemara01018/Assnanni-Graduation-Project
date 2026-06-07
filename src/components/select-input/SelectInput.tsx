import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { ChevronDown } from "lucide-react";

interface FilterType {
  experience: string;
  rating: string;
  availability: string;
  gender: string;
  sort: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  options: { label: string; value: string }[];
  setFilter: Dispatch<SetStateAction<FilterType>>;
}

function SelectInput({ id, label, options, setFilter }: SelectInputProps) {
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-(--color-text-light) uppercase tracking-wide"
      >
        {label}
      </label>

      <div className="relative w-full flex items-center">
        <select
          name={id}
          id={id}
          onChange={handleChange}
          className="w-full appearance-none rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) text-sm pl-3.5 pr-10 py-2.5 outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all cursor-pointer disabled:opacity-40"
        >
          {options.map((option, idx) => (
            <option key={idx} value={option.value} className="bg-(--color-surface) text-(--color-text)">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none flex items-center justify-center text-gray-400 dark:text-gray-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export default SelectInput;