import { MdOutlineMail } from "react-icons/md"

function VerifyEmailPage() {
    return (
        <div className="py-16 px-4 flex flex-col items-center">
            <div className="flex flex-col items-center gap-6 max-sm:max-w-[500px]  sm:w-[500px] bg-(--color-surface) p-8 rounded-xl shadow-xl">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center ">
                    <MdOutlineMail className="w-8 h-8 text-(--color-primary)" />
                </div>
                <div className="flex flex-col  items-center">
                    <h1 className="text-3xl text-(--color-text)">Verify Your Email</h1>
                    <p className="text-(--color-text-light) text-center">We've sent a 6-digit code to <span className="text-(--color-primary)">marhjmal6@gmail.com</span></p>
                </div>
                <div className="flex flex-col  items-center">
                    <p className="text-(--color-text)">Enter Verification Code</p>
                    <div>
                        <div className="flex items-center gap-2 my-4">
                            <input type="text" className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)" />
                            <input type="text" className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)" />
                            <input type="text" className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)" />
                            <input type="text" className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)" />
                            <input type="text" className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)" />
                            <input type="text" className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)" />
                            

                        </div>
                        <button className="bg-(--color-primary) py-2 px-4 rounded-sm w-full hover:bg-(--color-primary-light) cursor-pointer duration-100 transition duration-200">Verify Email</button>
                    </div>
                </div>
                <div className="text-(--color-primary) hover:text-(--color-primary-light) cursor-pointer transition duration-200">
                    Didn't receive the code? Resend
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailPage