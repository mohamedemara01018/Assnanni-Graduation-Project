
import { Outlet, useLocation } from "react-router";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Loading from "../loading/Loading";
import useMinimumLoading from "@/hooks/useMinimumLoading";

function PublicLayout() {
    const { pathname } = useLocation();
    const isLandingLoading = useMinimumLoading();

    if (pathname === "/" && isLandingLoading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <main className="flex-1 w-full mt-23">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default PublicLayout;
