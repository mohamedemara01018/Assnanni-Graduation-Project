import { useEffect, useState, type ReactNode } from "react"
import SideBar from "../sidebar/SideBar"
import BottomBar from "../bottom-bar/BottomBar";
import SearchInput from "../search-input/SearchInput";
import { HiOutlineMoon } from "react-icons/hi";
import { IoIosNotificationsOutline } from "react-icons/io";


interface DashboardLayoutProp {
    children: ReactNode,
    pageTitle: String
}

function DashboardLayout({ children, pageTitle }: DashboardLayoutProp) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width:768px)');
        console.log(matchMedia)
        const handleChange = (e: any) => {
            setSidebarCollapsed(e.matches)
        }

        setSidebarCollapsed(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange)

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        }

    }, [])
    useEffect(() => {
        console.log(sidebarCollapsed)
    }, [sidebarCollapsed])

    function handleToggleCollapse() {
        setSidebarCollapsed(!sidebarCollapsed)
    }
    return (
        <div>
            <div >
                <div className="relative flex ">
                    {!sidebarCollapsed ? <div className={`flex flex-col justify-between bg-(--color-surface) border border-(--color-border)  fixed bottom-0 top-0 left-0 h-screen  ${sidebarCollapsed ? 'hidden' : 'w-60'}`}>
                        <SideBar collapsed={sidebarCollapsed} onToggleCollapse={handleToggleCollapse} />
                    </div> : <BottomBar />}
                    <div className={`w-full ${sidebarCollapsed ? '' : 'ml-60'} max-sm:m-auto`}>
                        <div className="flex items-center justify-center h-16 border-b border-(--color-border) bg-(--color-surface)">
                            <div className="wrapper flex items-center justify-between gap-2">
                                <div className="text-xl font-semibold">{pageTitle}</div>
                                <div className="flex items-center gap-2 font-extrabold">
                                    <SearchInput />
                                    <div className="p-2 bg-(--color-bg-link) hover:bg-(--color-bg-link-hover) rounded-lg text-2xl cursor-pointer">
                                        <HiOutlineMoon />
                                    </div>
                                    <div className="relative p-2 bg-(--color-bg-link) hover:bg-(--color-bg-link-hover) rounded-lg text-2xl cursor-pointer">
                                        <IoIosNotificationsOutline />
                                        <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-2"></span>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className={`py-6 wrapper flex  flex-col gap-8 ${sidebarCollapsed ? 'mb-20' : ''}`}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout