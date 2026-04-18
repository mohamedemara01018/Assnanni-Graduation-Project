
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

function ThemeToggle() {
    const [isDark, setDark] = useState(false);

    useEffect(() => {
        const htmlEle = document.documentElement;
        const theme = localStorage.getItem('theme');

        if (theme === 'dark') {
            htmlEle.classList.add('dark');
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDark(true);
        } else {
            htmlEle.classList.remove('dark');
            setDark(false);
        }
    }, []);

    const handleTheme = () => {
        const htmlEle = document.documentElement;
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme === 'dark') {
            htmlEle.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setDark(false);
        } else {
            htmlEle.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setDark(true);
        }
    };

    return (
        <button onClick={handleTheme} className='cursor-pointer p-2 rounded-xl hover:bg-(--color-bg-link-hover) transition-all duration-300 hover:scale-110'>
            {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
        </button>
    )
}

export default ThemeToggle