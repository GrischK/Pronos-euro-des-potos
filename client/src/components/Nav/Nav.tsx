import React, {ReactNode} from "react";
import {NavLink} from "react-router-dom";
import styles from "./Nav.module.css"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export interface NavProps {
    children: ReactNode;
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

export default function Nav({children}: NavProps) {

    const url = window.location.href;

    console.log(url)

    return (
        <div
            className={styles.navBar}
        >
            <button onClick={topFunction} className={styles.top_button}>
                <ArrowUpwardIcon/>
            </button>
            <nav>
                <NavLink
                    to={"/"}
                >
                    Accueil
                </NavLink>
                {
                    !url.includes('matches') && (
                        <NavLink
                            to={"/matches"}
                        >
                            Mes pronos
                        </NavLink>
                    )
                }
                {
                    !url.includes('pronos') && (
                        <NavLink
                            to={"/pronos"}
                        >
                            Tous les pronos
                        </NavLink>
                    )
                }
                {
                    !url.includes('classement') && (
                        <NavLink
                            to={"/classement"}
                        >
                            Classement
                        </NavLink>
                    )
                }
            </nav>
            {children}
        </div>
    )
}