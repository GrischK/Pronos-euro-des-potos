import {useState} from "react";
import {useLoginMutation} from "../../gql/generated/schema";
import {NavLink} from "react-router-dom";

export default function Login() {
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const [passwordShown, setPasswordShown] = useState(false);
    const [login] = useLoginMutation()
    const togglePassword = () => setPasswordShown(!passwordShown);

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                login({variables: {data: credentials}}).then(() => {
                    console.log('ok')
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
                <label htmlFor="password">
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
                    >
                        Show password
                    </button>
                    <button type="submit">
                        Se connecter
                    </button>
                    <NavLink to={'/sign-up'}>
                        <button
                            type="button"
                        >
                            Créer un compte
                        </button>
                    </NavLink>

                </label>
            </form>
        </div>
    )
}