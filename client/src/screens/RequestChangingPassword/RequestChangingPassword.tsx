import {useState} from "react";
import {useSendPasswordEmailMutation} from "../../gql/generated/schema";
import styles from "./RequestChangingPassword.module.css"

export default function RequestChangingPassword() {
    const [email, setEmail] = useState({
        email: "",
    });
    const [sendEmail] = useSendPasswordEmailMutation();

    return (
        <div className={styles.requestChangingPassword_container}>
            <form
                // className={"emailPasswordContainer"}
                onSubmit={(e) => {
                    e.preventDefault();
                    sendEmail({variables: {data: email}})
                        .then(() => {
                            console.log("ok");
                        })
                        .catch(console.error);
                }}
            >
                <p>
                    Saisis ton email pour recevoir un lien permettant de modifier ton mot de passe.
                </p>
                <label htmlFor="email">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={email.email}
                        onChange={(e) => setEmail({email: e.target.value})}
                    ></input>
                </label>
                <div>
                    {/*<button*/}
                    {/*    // className={"primaryButton"}*/}
                    {/*>Retour</button>*/}
                    <button
                        type="submit"
                        style={{color:"white"}}
                        // className={"tertiaryButton"}
                        // onClick={() => toast("please check your email")}
                    >
                        Valider
                    </button>
                </div>
            </form>
        </div>
    )
}