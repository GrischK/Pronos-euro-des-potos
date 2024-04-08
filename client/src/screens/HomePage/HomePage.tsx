import styles from './HomePage.module.css'
import {SparklesCore} from "../../components/ui/sparkles";
import {NavLink} from "react-router-dom";
import GradientButton from "../../components/GradientButton/GradientButton";
import {useGetProfileQuery} from "../../gql/generated/schema";
import Switch from "@mui/material/Switch";
import * as React from "react";

interface HomePageProps {
    handlePrediction: () => void,
    predictionStatus: boolean
}

export default function HomePage({handlePrediction, predictionStatus}: HomePageProps) {
    const {data: current, refetch} = useGetProfileQuery();
    const userIsLogged = current?.profile?.id
    const user = current?.profile

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
                {
                    userIsLogged && user?.role === 'admin' && (
                        <NavLink to={'/admin'}>
                            <GradientButton>
                                Admin
                            </GradientButton>
                        </NavLink>
                    )
                }
            </div>
            <div className={styles.admin_container}>
                Pronos activés
                <Switch
                    checked={predictionStatus}
                    onChange={handlePrediction}
                    inputProps={{'aria-label': 'controlled'}}
                />
            </div>
        </div>
    )
}