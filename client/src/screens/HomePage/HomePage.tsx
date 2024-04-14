import styles from './HomePage.module.css'
import {NavLink} from "react-router-dom";
import {useGetProfileQuery, useUpdateAppStatusMutation} from "../../gql/generated/schema";
import Switch from "@mui/material/Switch";
import * as React from "react";
import {LampContainer} from "../../components/ui/Lamp";
import {motion} from "framer-motion";
import {Button} from "../../components/ui/Animated-button";

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
        <div style={{background: "#020617"}}>
            <LampContainer>
                <motion.h1
                    initial={{opacity: 0.5, y: 100}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
                >
                    <div className={styles.title_container}>
                        <h1 className={styles.title}>
                            Pronos
                        </h1>
                        <h1 className={styles.title_slim}>&nbsp;de l'Euro</h1>
                    </div>
                </motion.h1>
            </LampContainer>
            <div className={styles.buttons_container}>
                {
                    !userIsLogged && (
                        <>
                            <NavLink to={'/sign-up'}>
                                <Button
                                    borderRadius="1.75rem"
                                    className="bg-slate-900 text-white border-slate-800"
                                >
                                    Inscription
                                </Button>
                            </NavLink>
                            <NavLink to={'/login'}>
                                <Button
                                    borderRadius="1.75rem"
                                    className="bg-slate-900 text-white border-slate-800"
                                >
                                    Connexion
                                </Button>
                            </NavLink>
                        </>
                    )
                }
                {
                    userIsLogged && (
                        <>
                            <NavLink to={'/matches'}>
                                <Button
                                    rx={"10%"}
                                    borderRadius="1.75rem"
                                    className="bg-slate-900 text-white border-slate-800"
                                >
                                    Mes pronos
                                </Button>
                            </NavLink>
                            <NavLink to={'/pronos'}>
                                <Button
                                    rx={"80%"}
                                    borderRadius="1.75rem"
                                    className="bg-slate-900 text-white border-slate-800"
                                >
                                    Tous les pronos
                                </Button>
                            </NavLink>
                        </>

                    )
                }
                {
                    userIsLogged && user?.role === 'admin' && (
                        <NavLink to={'/admin'}>
                            <Button
                                rx={"40%"}
                                borderRadius="1.75rem"
                                className="bg-slate-900 text-white border-slate-800"
                            >
                                Admin
                            </Button>
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