import {useState} from "react";
import {useCreateUserMutation} from "../../gql/generated/schema";
import styles from "./SignUp.module.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {GradientInput} from "../../components/ui/Gradient-input";
import {AnimatedButton} from "../../components/ui/Animated-button";
import {useNavigate} from "react-router-dom";

export default function SignUp() {
    const [userInfo, setUserInfo] = useState({email: "", password: "", userName: ""});
    const [passwordShown, setPasswordShown] = useState(false);

    const [createUser] = useCreateUserMutation()

    const togglePassword = () => setPasswordShown(!passwordShown);

    const navigate = useNavigate()
    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.signUp_container}>
            <div className={styles.back_button}>
                <AnimatedButton
                    onClick={goBack}
                >
                    Retour
                </AnimatedButton>
            </div>
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
                    <GradientInput
                        className={styles.signUp_input}
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
                    <GradientInput
                        className={styles.signUp_input}
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
                    <GradientInput
                        className={styles.signUp_input}
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
                <AnimatedButton type="submit">
                    Créer un compte
                </AnimatedButton>

            </form>
        </div>
    )
}