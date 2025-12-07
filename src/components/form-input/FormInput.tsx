interface FormInputProps {
    id: string
    label: string
    type: string
    placeholder: string,
    name: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FormInput({ id, label, type, placeholder, name, handleChange }: FormInputProps) {
    return (
        <div className="input-field" >
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                name={name}
                onChange={handleChange}
            />
        </div>  
    )
}