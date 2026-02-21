interface SelectInputProb {
    id: string,
    label: string,
    options: string[]
}
function SelectInput({ id, label, options }: SelectInputProb) {
    return (
        <div className='flex flex-col gap-2 items-start '>
            <label htmlFor={id}>{label}</label>
            <select name={id} id={id} className='w-full p-2 border-2 border-(--color-border) rounded-lg'>
                {
                    options && options.map((option, idx) => {
                        return (
                            <option key={idx} value={option}>{option}</option>
                        )
                    })
                }

            </select>
        </div>
    )
}

export default SelectInput