import { useId, useState } from "react";
import "./ContactPage.css";

/** Page Contact — coordonnées à confirmer, formulaire de démonstration. */
export default function ContactPage() {
  const [envoye, setEnvoye] = useState(false);
  const idSujet = useId();
  const idNom = useId();
  const idCourriel = useId();
  const idMessage = useId();

  function surEnvoi(evenement: React.FormEvent) {
    evenement.preventDefault();
    setEnvoye(true);
  }

  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Espaces</span>
          <h1>Contact</h1>
          <p>Rejoignez le programme sportif des Alérions.</p>
        </div>
      </header>

      <div className="al-split">
        <div className="al-split__panel al-split__panel--blue">
          <div className="al-contact-info">
            <div className="al-contact-info__item">
              <h3>Adresse</h3>
              <p>Coordonnées à confirmer</p>
            </div>
            <div className="al-contact-info__item">
              <h3>Téléphone</h3>
              <p>Coordonnées à confirmer</p>
            </div>
            <div className="al-contact-info__item">
              <h3>Courriel</h3>
              <p>Coordonnées à confirmer</p>
            </div>
            <div className="al-contact-info__item">
              <h3>Horaires</h3>
              <p>Information à confirmer</p>
            </div>
          </div>
        </div>

        <div className="al-split__panel">
          <form className="al-contact-form" onSubmit={surEnvoi}>
            <div className="al-contact-form__field">
              <label htmlFor={idSujet}>Sujet</label>
              <input id={idSujet} name="sujet" type="text" required />
            </div>
            <div className="al-contact-form__field">
              <label htmlFor={idNom}>Nom</label>
              <input id={idNom} name="nom" type="text" required />
            </div>
            <div className="al-contact-form__field">
              <label htmlFor={idCourriel}>Courriel</label>
              <input id={idCourriel} name="courriel" type="email" required />
            </div>
            <div className="al-contact-form__field">
              <label htmlFor={idMessage}>Message</label>
              <textarea id={idMessage} name="message" required />
            </div>
            <button type="submit" className="al-btn al-btn--outline-dark">
              Envoyer
            </button>
            <p className="al-contact-form__note" role="status">
              {envoye
                ? "Démonstration : ce formulaire n'envoie aucun message pour le moment."
                : "Ce formulaire est une démonstration — l'envoi réel sera branché avec les coordonnées officielles."}
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
