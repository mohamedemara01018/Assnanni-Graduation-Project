import { useEffect, useState, type ReactNode } from "react"
import SideBar from "../sidebar/SideBar"
import BottomBar from "../bottom-bar/BottomBar";
import TobNavbar from "../tob-navbar/TobNavbar";


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
                            <TobNavbar pageTitle={pageTitle} />
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