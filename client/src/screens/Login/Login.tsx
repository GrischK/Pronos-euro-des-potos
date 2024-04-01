import {useState} from "react";
import {
    useGetAllUsersQuery,
    useLoginMutation,
    useGetProfileQuery,
} from "../../gql/generated/schema";
import {NavLink} from "react-router-dom";
import styles from "./Login.module.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GradientButton from "../../components/GradientButton/GradientButton";

export default function Login() {
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const [passwordShown, setPasswordShown] = useState(false);
    const [login] = useLoginMutation()
    const {data: users} = useGetAllUsersQuery();
    console.log({users})

    const {data: current} = useGetProfileQuery();
    console.log({current})


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
                    }).catch(console.error)
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
                    <span className={styles.link_register}>
                        Créer un compte
                    </span>
                </NavLink>
            </form>
        </div>
    )
}