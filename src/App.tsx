import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CalendrierPage from "./pages/CalendrierPage";
import EvenementPage from "./pages/EvenementPage";
import MonEquipePage from "./pages/MonEquipePage";
import JoueurPage from "./pages/JoueurPage";
import MurPage from "./pages/MurPage";
import DefisPage from "./pages/DefisPage";
import CollectionPage from "./pages/CollectionPage";
import EquipesPage from "./pages/EquipesPage";
import SportPage from "./pages/SportPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import ChatApercuPage from "./pages/ChatApercuPage";
import ChatPage from "./pages/ChatPage";
import ResultatsPage from "./pages/ResultatsPage";
import ActualitesPage from "./pages/ActualitesPage";
import CulturePage from "./pages/CulturePage";
import ParentsPage from "./pages/ParentsPage";
import AthletesPage from "./pages/AthletesPage";
import EntraineursPage from "./pages/EntraineursPage";
import RessourcesPage from "./pages/RessourcesPage";
import ContactPage from "./pages/ContactPage";
import BoiteAIdeesPage from "./pages/BoiteAIdeesPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/*
        Hors <Layout> : la maquette desktop contient déjà une navigation
        dessinée (logo, nav principale, sélecteur d'équipe) — superposer le
        vrai Header créerait une deuxième navigation identique au-dessus.
        Voir le commentaire en tête de ChatApercuPage.tsx.
      */}
      <Route path="equipes/:sport/:equipe/chat" element={<ChatApercuPage />} />

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calendrier" element={<CalendrierPage />} />
        <Route path="calendrier/evenement/:id" element={<EvenementPage />} />
        <Route path="mon-equipe" element={<MonEquipePage />} />
        <Route path="joueurs/:numero" element={<JoueurPage />} />
        <Route path="mur" element={<MurPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="defis" element={<DefisPage />} />
        <Route path="collection" element={<CollectionPage />} />
        <Route path="equipes" element={<EquipesPage />} />
        <Route path="equipes/:sport" element={<SportPage />} />
        <Route path="equipes/:sport/:equipe" element={<TeamDetailPage />} />
        <Route path="resultats" element={<ResultatsPage />} />
        <Route path="actualites" element={<ActualitesPage />} />
        <Route path="culture" element={<CulturePage />} />
        <Route path="parents" element={<ParentsPage />} />
        <Route path="athletes" element={<AthletesPage />} />
        <Route path="entraineurs" element={<EntraineursPage />} />
        <Route path="ressources" element={<RessourcesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="boite-a-idees" element={<BoiteAIdeesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
