import styles from './HomePage.module.css'
import {SparklesCore} from "../../components/ui/sparkles";
import {NavLink} from "react-router-dom";
import GradientButton from "../../components/GradientButton/GradientButton";
import {useGetProfileQuery, useUpdateAppStatusMutation} from "../../gql/generated/schema";
import Switch from "@mui/material/Switch";
import * as React from "react";

interface HomePageProps {
    handlePredictionSetting: () => void,
    app: boolean | undefined
}

export default function HomePage({handlePredictionSetting, app}: HomePageProps) {
    const {data: current} = useGetProfileQuery();
    const userIsLogged = current?.profile?.id
    const user = current?.profile


    const [changePredictionsStatus] = useUpdateAppStatusMutation()


    const handleChange = () => {
        handlePredictionSetting()
        changePredictionsStatus()
    }

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
                {
                    !userIsLogged && (
                        <>
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
                        </>
                    )
                }
                {
                    userIsLogged && (
                        <>
                            <NavLink to={'/matches'}>
                                <GradientButton>
                                    Mes pronos
                                </GradientButton>
                            </NavLink>
                            <NavLink to={'/pronos'}>
                                <GradientButton>
                                    Tous les pronos
                                </GradientButton>
                            </NavLink>
                        </>

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
            {
                user?.role === 'admin' && (
                    <div className={styles.admin_container}>
                        Pronos activés
                        <Switch
                            color="warning"
                            checked={app}
                            onChange={handleChange}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    </div>
                )
            }
        </div>
    )
}