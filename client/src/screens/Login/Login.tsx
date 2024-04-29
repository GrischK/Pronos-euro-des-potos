import styles from "./Login.module.css";
import * as React from "react";
import {useState} from "react";
import {useGetProfileQuery, useLoginMutation,} from "../../gql/generated/schema";
import {GradientInput} from "../../components/ui/Gradient-input";
import {AnimatedButton} from "../../components/ui/Animated-button";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import {BackgroundBeams} from "../../components/ui/Background-beams";
import {Alert, Snackbar} from "@mui/material";
import {handleCloseSnackbar} from "../../utils/functions";
import {NavLink, useNavigate} from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {errorToast} from "../../utils/styles";

export default function Login() {
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const [passwordShown, setPasswordShown] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorOpen, setErrorOpen] = React.useState(false);

    const [login] = useLoginMutation();

    const {data: current, client} = useGetProfileQuery({
        errorPolicy: "ignore",
    });

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    const handleClose = handleCloseSnackbar(setErrorOpen);

    const togglePassword = () => setPasswordShown(!passwordShown);

    return (
        <div className={styles.login_container}>
            <div className={"back_button"}>
                <ButtonHoverGradient onClick={goBack}>Retour</ButtonHoverGradient>
            </div>
            <div className={styles.login_title_container}>
                <h1 className={styles.login_title}>Conne</h1>
                <h1 className={styles.login_title_slim}>xion</h1>
            </div>
            <form
                className={styles.login_form}
                onSubmit={(e) => {
                    e.preventDefault();
                    login({variables: {data: credentials}})
                        .then(() => {
                            client.resetStore();
                            navigate("/");
                        })
                        .catch(() => {
                            setErrorMessage(`Email ou mot de passe invalide`);
                            setErrorOpen(true);
                        });
                }}
            >
                <label htmlFor="email" className={styles.login_input}>
                    <GradientInput
                        required={true}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Adresse mail"
                        autoComplete={"on"}
                        value={credentials.email}
                        onChange={(e) =>
                            setCredentials({...credentials, email: e.target.value})
                        }
                    />
                </label>
                <label
                    htmlFor="password"
                    className={`${styles.login_relative_container} ${styles.login_input}`}
                >
                    <GradientInput
                        required={true}
                        className={"passwordInput"}
                        id="password"
                        type={passwordShown ? "text" : "password"}
                        placeholder="Mot de passe"
                        autoComplete={"on"}
                        value={credentials.password}
                        onChange={(e) =>
                            setCredentials({...credentials, password: e.target.value})
                        }
                    ></GradientInput>{" "}
                    <button
                        type="button"
                        onClick={togglePassword}
                        className={styles.login_show_password}
                    >
                        {passwordShown ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                    </button>
                </label>
                <AnimatedButton type="submit">Se connecter</AnimatedButton>
                <NavLink className={styles.marginTop} to={"/sign-up"}>
                    <ButtonHoverGradient className={'text-xs font-light'}>Créer un
                        compte</ButtonHoverGradient>
                </NavLink>
                <NavLink to={"/request-changing-password"}>
                    <ButtonHoverGradient className={'text-xs font-light'}>Mot de passe oublié
                        ?</ButtonHoverGradient>
                </NavLink>
            </form>
            <BackgroundBeams className={"-z-1"}/>
            {errorMessage && (
                <Snackbar
                    open={errorOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity="error" sx={errorToast}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
        </div>
    );
}
