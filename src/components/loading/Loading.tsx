import logo from "../../assets/logo.png";

interface LoadingProps {
    className?: string;
}

function Loading({ className = "" }: LoadingProps) {
    return (
        <div className={`flex flex-col items-center justify-center min-h-screen w-full bg-(--color-bg) ${className}`}>

            <div className="relative flex items-center justify-center">

                <div className="w-[250px] h-[250px] border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

                <img
                    src={logo}
                    alt="logo"
                    className="absolute h-16"
                    style={{ animation: "scaleUpDown 1.5s ease-in-out infinite" }}
                />
            </div>

            <p className="mt-6 text-(--color-text-light) text-sm tracking-wide">
                loading...
            </p>

            <style>
                {`
                    @keyframes scaleUpDown {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                    }
                `}
            </style>
        </div>
    );
}

export default Loading;
