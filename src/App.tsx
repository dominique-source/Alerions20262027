import { Navigate, Route, Routes } from "react-router-dom";
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
import MembrePage from "./pages/MembrePage";
import TeamChatPage from "./pages/TeamChatPage";
import ChatPage from "./pages/ChatPage";
import ConnexionPage from "./pages/ConnexionPage";
import ComptePage from "./pages/ComptePage";
import JoueurDashboardPage from "./pages/JoueurDashboardPage";
import EntraineurDashboardPage from "./pages/EntraineurDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RequireAuth from "./components/auth/RequireAuth";
import ResultatsPage from "./pages/ResultatsPage";
import ActualitesPage from "./pages/ActualitesPage";
import CulturePage from "./pages/CulturePage";
import ParentsPage from "./pages/ParentsPage";
import RessourcesPage from "./pages/RessourcesPage";
import ContactPage from "./pages/ContactPage";
import BoiteAIdeesPage from "./pages/BoiteAIdeesPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="equipes/:sport/:equipe/chat" element={<RequireAuth><TeamChatPage /></RequireAuth>} />
      <Route path="connexion" element={<ConnexionPage />} />
      <Route path="compte" element={<ComptePage />} />
      <Route
        path="espace/joueur"
        element={
          <RequireAuth espaceRequis="joueur">
            <JoueurDashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="espace/entraineur"
        element={
          <RequireAuth espaceRequis="entraineur">
            <EntraineurDashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="espace/admin"
        element={
          <RequireAuth espaceRequis="administration">
            <AdminDashboardPage />
          </RequireAuth>
        }
      />

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calendrier" element={<CalendrierPage />} />
        <Route path="calendrier/evenement/:id" element={<EvenementPage />} />
        <Route path="mon-equipe" element={<MonEquipePage />} />
        <Route path="joueurs/:numero" element={<JoueurPage />} />
        <Route path="mur" element={<MurPage />} />
        <Route path="chat" element={<RequireAuth><ChatPage /></RequireAuth>} />
        <Route path="defis" element={<DefisPage />} />
        <Route path="collection" element={<CollectionPage />} />
        <Route path="equipes" element={<EquipesPage />} />
        <Route path="equipes/:sport" element={<SportPage />} />
        <Route path="equipes/:sport/:equipe" element={<TeamDetailPage />} />
        <Route path="equipes/:sport/:equipe/membres/:idMembre" element={<MembrePage />} />
        <Route path="resultats" element={<ResultatsPage />} />
        <Route path="actualites" element={<ActualitesPage />} />
        <Route path="culture" element={<CulturePage />} />
        <Route path="parents" element={<ParentsPage />} />
        <Route path="athletes" element={<Navigate to="/espace/joueur" replace />} />
        <Route path="entraineurs" element={<Navigate to="/espace/entraineur" replace />} />
        <Route path="ressources" element={<RessourcesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="boite-a-idees" element={<BoiteAIdeesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
