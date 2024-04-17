import styles from './HomePage.module.css'
import {NavLink, useNavigate} from "react-router-dom";
import {useGetProfileQuery, useLogoutMutation, useUpdateAppStatusMutation} from "../../gql/generated/schema";
import Switch from "@mui/material/Switch";
import * as React from "react";
import {LampContainer} from "../../components/ui/Lamp";
import {motion} from "framer-motion";
import {AnimatedButton} from "../../components/ui/Animated-button";
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface UserProfile {
    id: number;
    email: string;
    userName: string;
    picture?: string | null;
    role?: string | null;
}

interface HomePageProps {
    handlePredictionSetting: () => void,
    app: boolean | undefined,
    userProfile: UserProfile | undefined;
}

export default function HomePage({handlePredictionSetting, app, userProfile}: HomePageProps) {
    const {data: current, client} = useGetProfileQuery(
        {errorPolicy: "ignore",});
    const userIsLogged = current?.profile?.id
    const user = userProfile

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        const body = document.getElementsByTagName('body')[0]
        body.style.background = "0"
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    console.log(user)
    const [changePredictionsStatus] = useUpdateAppStatusMutation()


    const handleChange = () => {
        handlePredictionSetting()
        changePredictionsStatus()
    }

    const [logout] = useLogoutMutation()

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        await client.resetStore();
        navigate('/')
    }

    return (
        <div className={styles.homePage_container}>
            {user && (
                <div className={styles.user_info}>

                    <AnimatedButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <PersonPinIcon className={styles.user_icon}/>
                        {user.userName}
                    </AnimatedButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>Mon profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                    </Menu>
                </div>
            )}
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
                                <AnimatedButton
                                    borderRadius="1.75rem"
                                    className="bg-slate-900 text-white border-slate-800"
                                >
                                    Inscription
                                </AnimatedButton>
                            </NavLink>
                            <NavLink to={'/login'}>
                                <AnimatedButton
                                    borderRadius="1.75rem"
                                    className="bg-slate-900 text-white border-slate-800"
                                >
                                    Connexion
                                </AnimatedButton>
                            </NavLink>
                        </>
                    )
                }
                {
                    userIsLogged && (
                        <>
                            <NavLink to={'/matches'}>
                                <AnimatedButton
                                    rx={"10%"}
                                    borderRadius="1.75rem"
                                    className="bg-slate-900 text-white border-slate-800"
                                >
                                    Mes pronos
                                </AnimatedButton>
                            </NavLink>
                            <NavLink to={'/pronos'}>
                                <AnimatedButton
                                    rx={"80%"}
                                    borderRadius="1.75rem"
                                    className="bg-slate-900 text-white border-slate-800"
                                >
                                    Tous les pronos
                                </AnimatedButton>
                            </NavLink>
                        </>

                    )
                }
                {
                    userIsLogged && user?.role === 'admin' && (
                        <NavLink to={'/admin'}>
                            <AnimatedButton
                                rx={"40%"}
                                borderRadius="1.75rem"
                                className="bg-slate-900 text-white border-slate-800"
                            >
                                Admin
                            </AnimatedButton>
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