import styles from './HomePage.module.css'
import {SparklesCore} from "../../components/ui/sparkles";
import {NavLink} from "react-router-dom";

export default function HomePage() {
    return (
        <div className={styles.homePage}>
            <h1 className={styles.title}>
                Pronos des potos
            </h1>
            <SparklesCore className={styles.sparkles}/>
            <NavLink to={'/sign-in'}>
                <button>
                    Inscription
                </button>
            </NavLink>
            <button>
                Connexion
            </button>

        </div>
    )
}