import { useNomsEquipes } from "../../hooks/useNomsEquipes";
import "./EquipeSelector.css";

interface EquipeSelectorProps {
  idEquipes: string[];
  idEquipeActif: string | null;
  onChange: (idEquipe: string) => void;
}

/**
 * Sélecteur d'équipe — construit depuis les rattachements actifs déjà
 * filtrés par rôle (voir equipesPourRole). Change seulement l'affichage :
 * chaque endpoint privé revérifie indépendamment que ce compte a bien
 * accès à l'équipe choisie, jamais une confiance dans ce sélecteur.
 */
export default function EquipeSelector({ idEquipes, idEquipeActif, onChange }: EquipeSelectorProps) {
  const noms = useNomsEquipes(idEquipes);

  if (idEquipes.length === 0) return null;

  if (idEquipes.length === 1) {
    return <span className="al-equipe-selecteur al-equipe-selecteur--unique">{noms[idEquipes[0]!] ?? "…"}</span>;
  }

  return (
    <label className="al-equipe-selecteur">
      <span className="sr-only">Choisir une équipe</span>
      <select value={idEquipeActif ?? ""} onChange={(e) => onChange(e.target.value)}>
        {idEquipes.map((id) => (
          <option key={id} value={id}>
            {noms[id] ?? "…"}
          </option>
        ))}
      </select>
    </label>
  );
}
