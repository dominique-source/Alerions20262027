import type { Evenement } from "../types";

function formaterDateICS(date: string, heure: string | null): string {
  const [annee, mois, jour] = date.split("-");
  const [h, m] = (heure ?? "00:00").split(":");
  return `${annee}${mois}${jour}T${h.padStart(2, "0")}${m.padStart(2, "0")}00`;
}

function echapperTexte(texte: string): string {
  return texte.replace(/([,;])/g, "\\$1");
}

/** Génère un fichier .ics minimal pour un événement, sans dépendance externe. */
export function genererICS(evenement: Evenement): string {
  const debut = formaterDateICS(evenement.date, evenement.heure);
  const lieu = evenement.lieu ?? "";
  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Alerions CFDL//Calendrier//FR",
    "BEGIN:VEVENT",
    `UID:${evenement.id}@alerions.cfdl`,
    `DTSTAMP:${formaterDateICS(evenement.date, evenement.heure)}Z`,
    `DTSTART:${debut}`,
    `SUMMARY:${echapperTexte(evenement.titre)}`,
    lieu ? `LOCATION:${echapperTexte(lieu)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lignes.join("\r\n");
}

/** Déclenche le téléchargement du fichier .ics dans le navigateur. */
export function telechargerICS(evenement: Evenement): void {
  const contenu = genererICS(evenement);
  const blob = new Blob([contenu], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = `${evenement.id}.ics`;
  document.body.appendChild(lien);
  lien.click();
  document.body.removeChild(lien);
  URL.revokeObjectURL(url);
}
