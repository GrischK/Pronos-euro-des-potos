import styles from './HomePage.module.css'
import {SparklesCore} from "../../components/ui/sparkles";
import {NavLink} from "react-router-dom";
import GradientButton from "../../components/GradientButton/GradientButton";

export default function HomePage() {
    return (
        <div className={styles.homePage}>
            <div className={styles.title_container}>
                <h1 className={styles.title}>
                    Pronos
                </h1>
                <h1 className={styles.title_slim}>&nbsp;de l'Euro</h1>
            </div>
            <SparklesCore className={styles.sparkles}/>
            <div className={styles.buttons_container}>
                <NavLink to={'/sign-up'}>
                    <GradientButton>
                        Inscription
                    </GradientButton>
                </NavLink>
                <NavLink to={'/login'}>
                    <GradientButton>
                        Connexion
                    </GradientButton>
                </NavLink>
            </div>
        </div>
    )
}