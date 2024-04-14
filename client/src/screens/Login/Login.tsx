import {useState} from "react";
import {
    useLoginMutation,
    useGetProfileQuery,
} from "../../gql/generated/schema";
import {NavLink, useNavigate} from "react-router-dom";
import styles from "./Login.module.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {GradientInput} from "../../components/ui/Gradient-input";
import {AnimatedButton} from "../../components/ui/Animated-button";

export default function Login() {
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const [passwordShown, setPasswordShown] = useState(false);
    const [login] = useLoginMutation()

    const {data: current, client} = useGetProfileQuery(
        {errorPolicy: "ignore",});

    console.log({current})

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    const togglePassword = () => setPasswordShown(!passwordShown);

    return (
        <div className={styles.login_container}>
            <div className={styles.back_button}>
                <AnimatedButton
                    onClick={goBack}
                >
                    Retour
                </AnimatedButton>
            </div>
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
                    login({variables: {data: credentials}})
                        .then(() => {
                                client.resetStore();
                                navigate('/')
                            }
                        ).catch(console.error)
                }}>
                <label htmlFor="email" className={styles.login_input}>
                    <GradientInput
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
                <label htmlFor="password" className={`${styles.login_relative_container} ${styles.login_input}`}>
                    <GradientInput
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
                <AnimatedButton type="submit">
                    Se connecter
                </AnimatedButton>
                <NavLink to={'/sign-up'}>
                    <span className={styles.link_register}>
                        <span>
                            Créer un compte
                        </span>
                    </span>
                </NavLink>
            </form>
        </div>
    )
}