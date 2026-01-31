import { useState } from "react";
import { CiSearch } from "react-icons/ci";

function SearchInput({ style, placeholder = 'search...', padding = 'p-2' }: { style?: string, placeholder?: string, padding?: string }) {
    const [isFoucs, setFoucs] = useState(false)
    return (
        <div className={`border-2 border-(-color-text) rounded-lg  bg-(--color-bg) ${style} ${isFoucs ? 'border-(--color-text-blue)' : ''}`} onFocus={() => setFoucs(true)} onBlur={() => setFoucs(false)}>
            <div className={`flex items-center gap-2 ${padding} w-full `}>
                <label htmlFor="search">
                    <CiSearch className="text-xl" />
                </label>
                <input id="search" type="text" className="outline-0 border-0 text-base font-medium  w-full " placeholder={placeholder} />
            </div>
        </div>
    )
}

export default SearchInput;
