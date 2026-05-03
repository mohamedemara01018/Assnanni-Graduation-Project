import { footerLinks } from "@/constants/footerConstant"
import FooterColumn from "./FooterColumns"
import logo from '../../assets/logo.png'

function Footer() {
    return (
        <footer className="bg-(--color-background) py-16 border-t-2 border-t-(--color-border) mt-10  shadow-(--color-shadow) shadow-top-2xl shadow-bottom-2xl">
            <div className="wrapper ">
                <div className="grid md:grid-cols-4 gap-8 ">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className=" h-10 rounded-lg flex items-center justify-center">
                                <img src={logo} className="w-full h-full" alt="" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Your trusted healthcare platform for seamless medical care.
                        </p>
                    </div>

                    {footerLinks.map((col, idx) => (
                        <FooterColumn key={idx} title={col.title} links={col.links} />
                    ))}

                    <div>
                        <h4 className="mb-4 text-(--color-text-light)">Contact</h4>
                        <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                            <li className=" hover:text-gray-200 hover:dark:text-gray-700 hover:cursor-pointer transition duration-150">support@assnani.com</li>
                            <li className=" hover:text-gray-200 hover:dark:text-gray-700 hover:cursor-pointer transition duration-150">+1 (800) 123-4567</li>
                            <li className=" hover:text-gray-200 hover:dark:text-gray-700 hover:cursor-pointer transition duration-150">24/7 Support Available</li>
                        </ul>
                    </div>
                </div>
                <div className="my-8 h-px bg-(--color-text-light) rounded-full"></div>
                <div className=""></div>
                <div className="text-gray-300 dark:text-gray-700 text-sm text-center">
                    <p>© 2025 Assnani. All rights reserved.</p>

                </div>
            </div>
        </footer>
    )
}

export default Footer