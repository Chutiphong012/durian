import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarReport from "@/components/NavbarReport";

export default function App({ Component, pageProps, router }) {
  const noNavbarRoutes = ["/login", "/register","/report","/profilegorn","/exportdata", "/importdata"];
  const noFooterRoutes = ["/login", "/register"];
  const isReportPage = ["/report", "/profilegorn", "/exportdata", "/importdata"].includes(router.pathname);

  return (
    <div>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      {isReportPage && <NavbarReport type="navbar" />} {/* Navbar แบบเฉพาะสำหรับหน้า /report /profilegorn /exportdata */}
      <Component {...pageProps} />
      {!noFooterRoutes.includes(router.pathname) && <Footer />}
    </div>
  );
}
