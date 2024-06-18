import React, { ReactNode, useEffect, useState } from "react";
import styles from "./Nav.module.css";
import { NavLink, useLocation } from "react-router-dom";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import MenuIconRounded from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export interface NavProps {
  children: ReactNode;
}

function topFunction() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  window.scrollTo({ top: 0, behavior: isMobile ? "auto" : "smooth" });
}

export default function Nav({ children }: NavProps) {
  const url = window.location.href;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavBar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuClassName = isMenuOpen ? styles.menu_open : "";

  useEffect(() => {
    function handleScroll() {
      setIsMenuOpen(false); // Fermer le menu burger lorsque l'utilisateur fait défiler la page
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className={styles.navBar}>
      {location.pathname !== "/classement" && (
        <button onClick={topFunction} className={styles.top_button}>
          <ArrowUpwardRoundedIcon />
        </button>
      )}

      <button onClick={handleNavBar} className={styles.burger_menu}>
        {isMenuOpen ? <CloseRoundedIcon /> : <MenuIconRounded />}
      </button>
      <nav className={menuClassName}>
        <NavLink to={"/"}>Accueil</NavLink>
        {!url.includes("tous-les-matches") && (
          <NavLink to={"/tous-les-matches"}>Mes pronos</NavLink>
        )}
        {!url.includes("tous-les-pronos") && (
          <NavLink to={"/tous-les-pronos"}>Tous les pronos</NavLink>
        )}
        {!url.includes("classement") && (
          <NavLink to={"/classement"}>Classement</NavLink>
        )}
      </nav>
      {children}
    </div>
  );
}
