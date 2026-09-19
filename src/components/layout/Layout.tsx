import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/** Gabarit commun à toutes les pages : navigation, contenu, pied de page. */
export default function Layout() {
  return (
    <>
      <a href="#contenu-principal" className="skip-link">
        Aller au contenu principal
      </a>
      <Header />
      <main id="contenu-principal">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
