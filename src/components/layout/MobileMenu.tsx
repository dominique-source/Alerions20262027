import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { navEspaces, navPrincipale } from "../../data/navigation";
import "./MobileMenu.css";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Menu mobile en tiroir : navigation principale + menu Espaces.
 * Accessible : piège Échap, verrouille le défilement de fond, ramène le
 * focus au déclencheur à la fermeture.
 */
export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const precedent = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    document.body.style.overflow = "hidden";

    function surTouche(evenement: KeyboardEvent) {
      if (evenement.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", surTouche);

    return () => {
      document.removeEventListener("keydown", surTouche);
      document.body.style.overflow = "";
      precedent?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="al-mmenu" id="menu-mobile">
      <div className="al-mmenu__backdrop" onClick={onClose} />
      <div
        className="al-mmenu__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        <div className="al-mmenu__top">
          <button
            type="button"
            className="al-mmenu__close"
            onClick={onClose}
            ref={closeBtnRef}
          >
            <span className="sr-only">Fermer le menu</span>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M3 3l12 12M15 3L3 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="al-mmenu__group-title">Navigation</p>
        <nav className="al-mmenu__list" aria-label="Navigation principale">
          {navPrincipale.map((lien) => (
            <NavLink
              key={lien.href}
              to={lien.href}
              end={lien.href === "/"}
              onClick={onClose}
            >
              {lien.label}
            </NavLink>
          ))}
        </nav>

        <p className="al-mmenu__group-title">Espaces</p>
        <nav className="al-mmenu__list al-mmenu__list--espaces" aria-label="Espaces">
          {navEspaces.map((lien) => (
            <NavLink key={lien.href} to={lien.href} onClick={onClose}>
              {lien.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
