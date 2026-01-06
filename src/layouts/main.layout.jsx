import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AppInit from "../utils/AppInit.jsx";
import { Outlet } from "react-router-dom";
function MainLayout() {
  return (
    <>
      <Navbar />
      <AppInit />
      <main className="container mx-auto px-4 mt-20 min-h-[80vh]"><Outlet /></main>
      <Footer />
    </>
  );
}

export default MainLayout;