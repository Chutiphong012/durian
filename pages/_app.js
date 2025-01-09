import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function App({ Component, pageProps, router }) {
  const noNavbarRoutes = ["/login", "/register"];
  const noFooterRoutes = ["/login", "/register"];

  return (
    <div>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      <Component {...pageProps} />
      {!noFooterRoutes.includes(router.pathname) && <Footer />}
    </div>
  );
}
