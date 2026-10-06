import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import TeamChatPage from "./TeamChatPage";

const state = vi.hoisted(() => ({
  params: { sport: "basketball", equipe: "cadet-masculin" },
  compte: { isAdmin: false, rattachements: [{ teamId: "team-A" }] },
  roster: { etat: "pret", equipe: { idEquipe: "team-A" }, rafraichir: vi.fn() },
}));
vi.mock("react-router-dom", () => ({
  useParams: () => state.params,
  Link: ({ to, children }: { to: string; children: unknown }) => createElement("a", { href: to }, children as never),
}));
vi.mock("../contexts/AuthContext", () => ({ useAuth: () => ({ compte: state.compte }) }));
vi.mock("../hooks/useRoster", () => ({ useRoster: () => state.roster }));
vi.mock("../components/chat/TeamChatRoom", () => ({
  default: ({ idEquipe }: { idEquipe: string }) => createElement("section", { "data-conversation": idEquipe }, "Conversation réelle"),
}));
function render() { return renderToStaticMarkup(createElement(TeamChatPage)); }
beforeEach(() => {
  state.params = { sport: "basketball", equipe: "cadet-masculin" };
  state.compte = { isAdmin: false, rattachements: [{ teamId: "team-A" }] };
  state.roster = { etat: "pret", equipe: { idEquipe: "team-A" }, rafraichir: vi.fn() };
});
describe("route du chat privé", () => {
  it("ouvre le vrai salon et revient à la page canonique de l’équipe", () => {
    const html = render();
    expect(html).toContain('data-conversation="team-A"');
    expect(html).toContain('href="/equipes/basketball/cadet-masculin"');
    expect(html).not.toContain("<picture");
    expect(html).not.toContain("<img");
  });
  it("attend la résolution de l’équipe sans afficher une fausse conversation", () => {
    state.roster.etat = "chargement";
    expect(render()).toContain("Chargement de l’équipe");
    expect(render()).not.toContain("data-conversation");
  });
  it("affiche Réessayer quand Sheets ne répond pas", () => {
    state.roster.etat = "erreur";
    expect(render()).toContain("Réessayer");
    expect(render()).not.toContain("data-conversation");
  });
  it("refuse un membre d’une autre équipe", () => {
    state.compte.rattachements = [{ teamId: "team-B" }];
    expect(render()).toContain("Accès refusé");
    expect(render()).not.toContain("data-conversation");
  });
  it("autorise un administrateur confirmé", () => {
    state.compte = { isAdmin: true, rattachements: [] };
    expect(render()).toContain('data-conversation="team-A"');
  });
  it("ne monte pas de salon pour une route d’équipe inconnue", () => {
    state.params.equipe = "inconnue";
    expect(render()).toContain("Cette équipe n&#x27;existe pas");
    expect(render()).not.toContain("data-conversation");
  });
});
