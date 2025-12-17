import type { ReactNode } from "react"
import SideBar from "../sidebar/SideBar"

interface DashboardLayoutProp {
    children: ReactNode,
    pageTitle: String
}

function DashboardLayout({ children, pageTitle }: DashboardLayoutProp) {
    return (
        <div>
            <div >
                <div className="relative flex ">
                    <SideBar />
                    <div className="w-full ml-64">
                        <div className="flex items-center justify-center h-16 border-b border-(--color-border) bg-(--color-surface)">
                            <div className="wrapper flex items-center justify-between gap-2">
                                <div className="text-xl font-semibold">{pageTitle}</div>
                                <div className="flex items-center gap-2 font-extrabold">
                                    <div>kdf</div>
                                    <div>kdf</div>
                                    <div>kdf</div>
                                </div>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout