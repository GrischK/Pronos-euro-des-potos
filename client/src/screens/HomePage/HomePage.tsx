import styles from './HomePage.module.css'
import {SparklesCore} from "../../components/ui/sparkles";
import {NavLink} from "react-router-dom";
import GradientButton from "../../components/GradientButton/GradientButton";
import {useGetProfileQuery} from "../../gql/generated/schema";

export default function HomePage() {
    const {data: current, refetch} = useGetProfileQuery();
    const userIsLogged = current?.profile?.id

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
                {
                    userIsLogged && (
                        <NavLink to={'/matches'}>
                            <GradientButton>
                                Home
                            </GradientButton>
                        </NavLink>
                    )
                }
            </div>
        </div>
    )
}