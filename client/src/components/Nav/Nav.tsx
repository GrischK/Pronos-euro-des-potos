import React, {ReactNode} from "react";
import {NavLink} from "react-router-dom";
import styles from "./Nav.module.css"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export interface NavProps {
    children: ReactNode;
}

function topFunction() {
    window.scrollTo({top: 0, behavior: 'smooth'})
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