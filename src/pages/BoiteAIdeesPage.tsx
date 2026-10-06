import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import DocumentRow from "../components/DocumentRow";
import SectionTitle from "../components/SectionTitle";
import { documents } from "../data/documents";
import { sports } from "../data/sports";
import { peutSoumettre, marquerSoumission, secondesAvantProchaineSoumission } from "../lib/rateLimit";
import type { CategorieIdee, RoleSoumission, SoumissionIdee } from "../types";
import "./BoiteAIdeesPage.css";

const libellesRole: Record<RoleSoumission, string> = {
  parent: "Parent",
  athlete: "Athlète",
  entraineur: "Entraîneur",
  personnel: "Membre du personnel",
};

const libellesCategorie: Record<CategorieIdee, string> = {
  equipement: "Équipement",
  evenement: "Événement",
  entrainement: "Entraînement",
  "vie-equipe": "Vie d'équipe",
  communication: "Communication",
  installations: "Installations",
  "media-day": "Media Day",
  autre: "Autre",
};

const docBoiteAIdees = documents.find((d) => d.slug === "boite-a-idees")!;
const autresProjets = documents.filter(
  (d) => d.categorie === "projet" && d.slug !== "boite-a-idees",
);

type Etat = "formulaire" | "envoi" | "succes" | "erreur";

const valeursInitiales: SoumissionIdee = {
  nom: "",
  courriel: "",
  role: "athlete",
  nomEnfant: null,
  sportConcerne: "general",
  categorie: "autre",
  titre: "",
  idee: "",
  resultatSouhaite: "",
  consentement: false,
  siteWeb: "",
};

function prefereMouvementReduit(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Page Boîte à idées : une feuille qu'on remplit puis qu'on « glisse »
 * dans la boîte Alérions. Animation < 2 s, version réduite si
 * prefers-reduced-motion. Envoi réel via /api/boite-a-idees (voir ce
 * fichier pour la configuration requise côté serveur).
 */
export default function BoiteAIdeesPage() {
  const [valeurs, setValeurs] = useState<SoumissionIdee>(valeursInitiales);
  const [erreurs, setErreurs] = useState<Partial<Record<keyof SoumissionIdee, string>>>({});
  const [etat, setEtat] = useState<Etat>("formulaire");
  const [codeErreurServeur, setCodeErreurServeur] = useState<string | null>(null);
  const [boiteAllumee, setBoiteAllumee] = useState(false);
  const [paperEnvoi, setPaperEnvoi] = useState(false);
  const [secondesAttente, setSecondesAttente] = useState(0);

  const idNom = useId();
  const idCourriel = useId();
  const idRole = useId();
  const idNomEnfant = useId();
  const idSport = useId();
  const idCategorie = useId();
  const idTitre = useId();
  const idIdee = useId();
  const idResultat = useId();
  const idConsentement = useId();
  const idHoneypot = useId();

  useEffect(() => {
    setSecondesAttente(secondesAvantProchaineSoumission("boite-a-idees"));
  }, []);

  const champ = <K extends keyof SoumissionIdee>(cle: K, val: SoumissionIdee[K]) => {
    setValeurs((v) => ({ ...v, [cle]: val }));
    setErreurs((e) => ({ ...e, [cle]: undefined }));
  };

  function valider(): boolean {
    const nouvellesErreurs: Partial<Record<keyof SoumissionIdee, string>> = {};

    if (!valeurs.nom.trim()) nouvellesErreurs.nom = "Le nom est obligatoire.";
    if (!valeurs.courriel.trim()) {
      nouvellesErreurs.courriel = "L'adresse courriel est obligatoire.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeurs.courriel)) {
      nouvellesErreurs.courriel = "L'adresse courriel n'est pas valide.";
    }
    if (valeurs.role === "parent" && !valeurs.nomEnfant?.trim()) {
      nouvellesErreurs.nomEnfant = "Le nom de votre enfant est obligatoire.";
    }
    if (!valeurs.titre.trim()) nouvellesErreurs.titre = "Le titre est obligatoire.";
    if (!valeurs.idee.trim()) nouvellesErreurs.idee = "Décrivez votre idée.";
    if (!valeurs.resultatSouhaite.trim()) {
      nouvellesErreurs.resultatSouhaite = "Le résultat souhaité est obligatoire.";
    }
    if (!valeurs.consentement) {
      nouvellesErreurs.consentement = "Le consentement est requis pour vous recontacter.";
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  }

  async function surEnvoi(evenement: FormEvent) {
    evenement.preventDefault();

    if (!valider()) return;

    if (!peutSoumettre("boite-a-idees")) {
      setSecondesAttente(secondesAvantProchaineSoumission("boite-a-idees"));
      setCodeErreurServeur("trop_de_soumissions");
      setEtat("erreur");
      return;
    }

    setEtat("envoi");
    const reduit = prefereMouvementReduit();
    if (!reduit) setPaperEnvoi(true);

    try {
      const reponse = await fetch("/api/boite-a-idees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valeurs),
      });
      const corps = (await reponse.json().catch(() => ({}))) as { ok?: boolean; code?: string };

      if (!reponse.ok || !corps.ok) {
        setCodeErreurServeur(corps.code ?? "envoi_echoue");
        setPaperEnvoi(false);
        setEtat("erreur");
        return;
      }

      marquerSoumission("boite-a-idees");

      const delai = reduit ? 0 : 1400;
      window.setTimeout(() => {
        setBoiteAllumee(true);
        window.setTimeout(
          () => {
            setEtat("succes");
          },
          reduit ? 0 : 400,
        );
      }, delai);
    } catch {
      setCodeErreurServeur("envoi_echoue");
      setPaperEnvoi(false);
      setEtat("erreur");
    }
  }

  const messageErreur = useMemo(() => {
    if (codeErreurServeur === "service_non_configure") {
      return "L'envoi automatique n'est pas encore activé sur ce site. Votre idée n'a pas pu être transmise pour le moment — merci de réessayer plus tard ou de contacter directement le Collège.";
    }
    if (codeErreurServeur === "trop_de_soumissions") {
      return `Vous avez déjà envoyé une idée récemment. Merci de réessayer dans ${secondesAttente || 60} secondes.`;
    }
    return "Une erreur est survenue pendant l'envoi. Vérifiez votre connexion et réessayez.";
  }, [codeErreurServeur, secondesAttente]);

  if (etat === "succes") {
    return (
      <section className="al-section al-section--blanc">
        <div className="container al-idees-succes">
          <h2>Ton idée est dans la boîte.</h2>
          <p>Merci de faire avancer les Alérions.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="al-idees-intro">
        <div className="container">
          <h1>Boîte à idées</h1>
          <p>
            Une feuille, une idée, une boîte Alérions. Ton avis façonne les prochains
            projets du programme sportif.
          </p>
        </div>
      </section>

      <section className="al-section al-section--ice">
        <div className="container al-idees-highlight">
          <h2>{docBoiteAIdees.titre}</h2>
          <p>{docBoiteAIdees.description}</p>
          <div className="al-idees-highlight__actions">
            <a
              className="al-btn al-btn--outline-dark"
              href={`/documents/${docBoiteAIdees.fichier}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir le projet
            </a>
            <a
              className="al-btn al-btn--outline-dark"
              href={`/documents/${docBoiteAIdees.fichier}`}
              download
            >
              Télécharger le PDF
            </a>
          </div>
        </div>
      </section>

      <section className="al-section al-section--blanc">
        <div className="container al-idees-scene">
          {etat === "erreur" && (
            <div className="al-idees-erreur" role="alert">
              <h2>Envoi impossible</h2>
              <p>{messageErreur}</p>
              <button
                type="button"
                className="al-btn al-btn--outline-dark al-idees-erreur__retour"
                onClick={() => setEtat("formulaire")}
              >
                Revenir au formulaire
              </button>
            </div>
          )}

          {etat !== "erreur" && (
            <div className="al-idees-paper-wrap">
              <form
                className={`al-idees-paper al-idees-form${paperEnvoi ? " al-idees-paper--envoi" : ""}`}
                onSubmit={surEnvoi}
                noValidate
              >
                <div className="al-idees-form__row">
                  <div className="al-idees-form__field">
                    <label htmlFor={idNom}>Nom</label>
                    <input
                      id={idNom}
                      type="text"
                      value={valeurs.nom}
                      onChange={(e) => champ("nom", e.target.value)}
                      aria-invalid={!!erreurs.nom}
                      aria-describedby={erreurs.nom ? `${idNom}-erreur` : undefined}
                      disabled={etat === "envoi"}
                    />
                    {erreurs.nom && (
                      <span className="al-idees-form__error" id={`${idNom}-erreur`}>
                        {erreurs.nom}
                      </span>
                    )}
                  </div>

                  <div className="al-idees-form__field">
                    <label htmlFor={idCourriel}>Adresse courriel</label>
                    <input
                      id={idCourriel}
                      type="email"
                      value={valeurs.courriel}
                      onChange={(e) => champ("courriel", e.target.value)}
                      aria-invalid={!!erreurs.courriel}
                      aria-describedby={erreurs.courriel ? `${idCourriel}-erreur` : undefined}
                      disabled={etat === "envoi"}
                    />
                    {erreurs.courriel && (
                      <span className="al-idees-form__error" id={`${idCourriel}-erreur`}>
                        {erreurs.courriel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="al-idees-form__row">
                  <div className="al-idees-form__field">
                    <label htmlFor={idRole}>Rôle</label>
                    <select
                      id={idRole}
                      value={valeurs.role}
                      onChange={(e) => champ("role", e.target.value as RoleSoumission)}
                      disabled={etat === "envoi"}
                    >
                      {Object.entries(libellesRole).map(([valeur, label]) => (
                        <option key={valeur} value={valeur}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {valeurs.role === "parent" && (
                    <div className="al-idees-form__field">
                      <label htmlFor={idNomEnfant}>Nom de mon enfant</label>
                      <input
                        id={idNomEnfant}
                        type="text"
                        value={valeurs.nomEnfant ?? ""}
                        onChange={(e) => champ("nomEnfant", e.target.value)}
                        aria-invalid={!!erreurs.nomEnfant}
                        aria-describedby={erreurs.nomEnfant ? `${idNomEnfant}-erreur` : undefined}
                        disabled={etat === "envoi"}
                      />
                      {erreurs.nomEnfant && (
                        <span className="al-idees-form__error" id={`${idNomEnfant}-erreur`}>
                          {erreurs.nomEnfant}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="al-idees-form__row">
                  <div className="al-idees-form__field">
                    <label htmlFor={idSport}>Sport concerné</label>
                    <select
                      id={idSport}
                      value={valeurs.sportConcerne}
                      onChange={(e) => champ("sportConcerne", e.target.value as SoumissionIdee["sportConcerne"])}
                      disabled={etat === "envoi"}
                    >
                      <option value="general">Général</option>
                      {sports.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="al-idees-form__field">
                    <label htmlFor={idCategorie}>Catégorie de l'idée</label>
                    <select
                      id={idCategorie}
                      value={valeurs.categorie}
                      onChange={(e) => champ("categorie", e.target.value as CategorieIdee)}
                      disabled={etat === "envoi"}
                    >
                      {Object.entries(libellesCategorie).map(([valeur, label]) => (
                        <option key={valeur} value={valeur}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="al-idees-form__field">
                  <label htmlFor={idTitre}>Titre court</label>
                  <input
                    id={idTitre}
                    type="text"
                    value={valeurs.titre}
                    onChange={(e) => champ("titre", e.target.value)}
                    aria-invalid={!!erreurs.titre}
                    aria-describedby={erreurs.titre ? `${idTitre}-erreur` : undefined}
                    disabled={etat === "envoi"}
                  />
                  {erreurs.titre && (
                    <span className="al-idees-form__error" id={`${idTitre}-erreur`}>
                      {erreurs.titre}
                    </span>
                  )}
                </div>

                <div className="al-idees-form__field">
                  <label htmlFor={idIdee}>Mon idée</label>
                  <textarea
                    id={idIdee}
                    value={valeurs.idee}
                    onChange={(e) => champ("idee", e.target.value)}
                    aria-invalid={!!erreurs.idee}
                    aria-describedby={erreurs.idee ? `${idIdee}-erreur` : undefined}
                    disabled={etat === "envoi"}
                  />
                  {erreurs.idee && (
                    <span className="al-idees-form__error" id={`${idIdee}-erreur`}>
                      {erreurs.idee}
                    </span>
                  )}
                </div>

                <div className="al-idees-form__field">
                  <label htmlFor={idResultat}>Résultat souhaité</label>
                  <textarea
                    id={idResultat}
                    value={valeurs.resultatSouhaite}
                    onChange={(e) => champ("resultatSouhaite", e.target.value)}
                    aria-invalid={!!erreurs.resultatSouhaite}
                    aria-describedby={
                      erreurs.resultatSouhaite ? `${idResultat}-erreur` : undefined
                    }
                    disabled={etat === "envoi"}
                  />
                  {erreurs.resultatSouhaite && (
                    <span className="al-idees-form__error" id={`${idResultat}-erreur`}>
                      {erreurs.resultatSouhaite}
                    </span>
                  )}
                </div>

                <div className="al-idees-form__consent">
                  <input
                    id={idConsentement}
                    type="checkbox"
                    checked={valeurs.consentement}
                    onChange={(e) => champ("consentement", e.target.checked)}
                    aria-invalid={!!erreurs.consentement}
                    aria-describedby={
                      erreurs.consentement ? `${idConsentement}-erreur` : undefined
                    }
                    disabled={etat === "envoi"}
                  />
                  <label htmlFor={idConsentement}>
                    J'autorise le Collège François-de-Laval à me recontacter au sujet de mon
                    idée.
                  </label>
                </div>
                {erreurs.consentement && (
                  <span className="al-idees-form__error" id={`${idConsentement}-erreur`}>
                    {erreurs.consentement}
                  </span>
                )}

                {/* Champ piège invisible — un robot le remplit, une personne ne le voit jamais. */}
                <div className="al-idees-form__honeypot" aria-hidden="true">
                  <label htmlFor={idHoneypot}>Laissez ce champ vide</label>
                  <input
                    id={idHoneypot}
                    type="text"
                    name="siteWeb"
                    tabIndex={-1}
                    autoComplete="off"
                    value={valeurs.siteWeb}
                    onChange={(e) => champ("siteWeb", e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="al-btn al-btn--primary al-idees-form__submit"
                  disabled={etat === "envoi"}
                >
                  {etat === "envoi" ? "Envoi en cours…" : "Glisser mon idée dans la boîte"}
                </button>
              </form>
            </div>
          )}

          <div className={`al-idees-box${boiteAllumee ? " al-idees-box--allumee" : ""}`}>
            <svg className="al-idees-box__svg" viewBox="0 0 120 100" aria-hidden="true">
              <rect x="10" y="30" width="100" height="60" fill="var(--alerions-blue)" />
              <polygon points="10,30 60,10 110,30" fill="var(--alerions-deep)" />
              <rect className="al-idees-box__slot" x="45" y="16" width="30" height="6" rx="2" />
              <circle className="al-idees-box__light" cx="60" cy="19" r="14" />
            </svg>
            <span className="al-idees-box__label">Boîte à idées Alérions</span>
          </div>
        </div>
      </section>

      {autresProjets.length > 0 && (
        <section className="al-section al-section--ice">
          <div className="container">
            <SectionTitle eyebrow="Projets Alérions" title="Les idées prennent vie" />
            <div className="al-doc-list">
              {autresProjets.map((document) => (
                <DocumentRow key={document.slug} document={document} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
