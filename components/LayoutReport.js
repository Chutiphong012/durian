import Navbar from "./NavbarReport";
import Footer from "./Footer";


export default function Layout({children}) {
    return (
        <div>
            <Navbar />
                {children}
            <Footer />
        </div>
    );
}
