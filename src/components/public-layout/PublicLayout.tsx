
import { Outlet } from 'react-router'
import Header from '../header/Header'
import Footer from '../footer/Footer'

function PublicLayout() {
    return (
        <>
            <Header />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default PublicLayout