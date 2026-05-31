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
    setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
}

function SelectInput({
    id,
    label,
    options,
    setFilter,
}: SelectInputProps) {
    function handleChange(
        e: React.ChangeEvent<HTMLSelectElement>
    ) {
        const { name, value } = e.target;

        setFilter((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <div className="flex flex-col gap-2 items-start">
            <label htmlFor={id}>{label}</label>

            <select
                name={id}
                id={id}
                onChange={handleChange}
                className="w-full p-2 border-2 border-(--color-border) rounded-lg"
            >
                {options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectInput;