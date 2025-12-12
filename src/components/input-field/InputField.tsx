
interface InputFieldProps {
    id: string
    label: string
    type: string
    placeholder: string,
    name: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}


function InputField({ id, label, type, placeholder, name, handleChange }: InputFieldProps) {
    return (
        <div className="flex flex-col items-start w-full gap-1">
            <label htmlFor={id} className="text-(--color-text)">{label}</label>
            <input id={id} type={type} placeholder={placeholder} name={name} onChange={handleChange} className="w-full px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-(--color-text)" />
        </div>
    )
}

export default InputField