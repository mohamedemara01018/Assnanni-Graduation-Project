import logo from '../../assets/logo.png'

function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">

            <div className="relative flex items-center justify-center">

                <div className="w-[250px] h-[250px] border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

                <img
                    src={logo}
                    alt="logo"
                    className="absolute h-16"
                    style={{ animation: 'scaleUpDown 1.5s ease-in-out infinite' }}
                />
            </div>

            {/* text */}
            <p className="mt-6 text-gray-500 text-sm tracking-wide">
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
    )
}

export default Loading