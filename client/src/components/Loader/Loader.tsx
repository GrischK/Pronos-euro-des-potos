import styles from "./Loader.module.css";
import * as React from "react";

export default function Loader(){
    return(
        <>
            <div className={styles.loader}>Chargement...</div>
            <div>
                <div className={styles.box}>
                    <div className={styles.shadow}></div>
                    <div className={styles.gravity}>
                        <div className={styles.ball}></div>
                    </div>
                </div>
            </div>
        </>
    )
}