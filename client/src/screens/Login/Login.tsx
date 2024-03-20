import {useState} from "react";
import {useLoginMutation} from "../../gql/generated/schema";
import {NavLink} from "react-router-dom";
import styles from "./Login.module.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GradientButton from "../../components/GradientButton/GradientButton";
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

export default function Login() {
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const [passwordShown, setPasswordShown] = useState(false);
    const [open, setOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const [login] = useLoginMutation()
    const togglePassword = () => setPasswordShown(!passwordShown);

    return (
        <div className={styles.login_container}>
            <div className={styles.login_title_container}>
                <h1 className={styles.login_title}>
                    Conne
                </h1>
                <h1 className={styles.login_title_slim}>xion</h1>
            </div>
            <form
                className={styles.login_form}
                onSubmit={(e) => {
                    e.preventDefault();
                    login({variables: {data: credentials}}).then(() => {
                        console.log('ok')
                    }).catch((error)=>{
                        console.log(error);
                        setOpen(true)
                        setSnackMessage('Informations de connexion incorrectes')
                    })
                }}>
                <label htmlFor="email">
                    <input
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
                <label htmlFor="password" className={styles.login_relative_container}>
                    <input
                        className={"passwordInput"}
                        id="password"
                        type={passwordShown ? "text" : "password"}
                        placeholder="Mot de passe"
                        autoComplete={"on"}
                        value={credentials.password}
                        onChange={(e) =>
                            setCredentials({...credentials, password: e.target.value})
                        }
                    ></input>{" "}
                    <button
                        type="button"
                        onClick={togglePassword}
                        className={styles.login_show_password}
                    >
                        {passwordShown ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                    </button>
                </label>
                <GradientButton type="submit">
                    Se connecter
                </GradientButton>
                <NavLink to={'/sign-up'}>
                    <span className={styles.link_register}                    >
                        Créer un compte
                    </span>
                </NavLink>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <SnackbarContent
                    className={styles.login_snackContent}
                    message={snackMessage}
                />
            </Snackbar>
        </div>
    )
}