import {useState} from "react";
import {useCreateUserMutation} from "../../gql/generated/schema";
import styles from "./SignUp.module.css"
import GradientButton from "../../components/GradientButton/GradientButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function SignUp() {
    const [userInfo, setUserInfo] = useState({email: "", password: "", userName: ""});
    const [passwordShown, setPasswordShown] = useState(false);

    const [createUser] = useCreateUserMutation()

    const togglePassword = () => setPasswordShown(!passwordShown);

    return (
        <div className={styles.signUp_container}>
            <div className={styles.title_container}>
                <h1 className={styles.signUp_title}>
                    Inscri
                </h1>
                <h1 className={styles.signUp_title_slim}>ption</h1>
            </div>
            <form
                className={styles.signUp_form}
                onSubmit={(e) => {
                    e.preventDefault();
                    createUser({variables: {data: userInfo}})
                        .then(() => {
                            console.log("ok");
                        })
                        .catch(console.error);
                }}
            >
                <label htmlFor="username">
                    <input
                        type={"text"}
                        id="username"
                        placeholder="Pseudo"
                        autoComplete={"off"}
                        value={userInfo.userName}
                        onChange={(e) =>
                            setUserInfo({...userInfo, userName: e.target.value})
                        }
                    />
                </label>
                <label htmlFor="email">
                    <input
                        type="email"
                        id={"email"}
                        name={"email"}
                        placeholder="Adresse mail"
                        autoComplete={"off"}
                        value={userInfo.email}
                        onChange={(e) =>
                            setUserInfo({...userInfo, email: e.target.value})
                        }
                    />
                </label>
                <label htmlFor="password" className={styles.relative_container}>
                    <input
                        type={passwordShown ? "text" : "password"}
                        id="password"
                        placeholder="Mot de passe"
                        autoComplete={"off"}
                        value={userInfo.password}
                        onChange={(e) =>
                            setUserInfo({...userInfo, password: e.target.value})
                        }
                    />
                    <button type="button" onClick={togglePassword} className={styles.show_password}>
                        {passwordShown ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                    </button>
                </label>
                <GradientButton type="submit">
                    Créer un compte
                </GradientButton>

            </form>
        </div>
    )
}