import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CalendrierPage from "./pages/CalendrierPage";
import EquipesPage from "./pages/EquipesPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import ResultatsPage from "./pages/ResultatsPage";
import ActualitesPage from "./pages/ActualitesPage";
import CulturePage from "./pages/CulturePage";
import ParentsPage from "./pages/ParentsPage";
import AthletesPage from "./pages/AthletesPage";
import EntraineursPage from "./pages/EntraineursPage";
import RessourcesPage from "./pages/RessourcesPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calendrier" element={<CalendrierPage />} />
        <Route path="equipes" element={<EquipesPage />} />
        <Route path="equipes/:slug" element={<TeamDetailPage />} />
        <Route path="resultats" element={<ResultatsPage />} />
        <Route path="actualites" element={<ActualitesPage />} />
        <Route path="culture" element={<CulturePage />} />
        <Route path="parents" element={<ParentsPage />} />
        <Route path="athletes" element={<AthletesPage />} />
        <Route path="entraineurs" element={<EntraineursPage />} />
        <Route path="ressources" element={<RessourcesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
