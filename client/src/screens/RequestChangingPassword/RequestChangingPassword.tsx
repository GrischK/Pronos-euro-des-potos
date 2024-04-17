import {useState} from "react";
import {useSendPasswordEmailMutation} from "../../gql/generated/schema";
import styles from "./RequestChangingPassword.module.css"
import * as React from "react";
import {GradientInput} from "../../components/ui/Gradient-input";
import {AnimatedButton} from "../../components/ui/Animated-button";
import {useNavigate} from "react-router-dom";

export default function RequestChangingPassword() {
    const [email, setEmail] = useState({
        email: "",
    });
    const [sendEmail] = useSendPasswordEmailMutation();

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.requestChangingPassword_container}>
            <div className={"back_button"}>
                <AnimatedButton
                    onClick={goBack}
                >
                    Retour
                </AnimatedButton>
            </div>
            <div className={styles.title_container}>
                <h1 className={styles.title}>
                    Nouveau
                </h1>
                <h1 className={styles.title_slim}>&nbsp;mot de passe</h1>
            </div>
            <form
                className={styles.formBlock_container}
                onSubmit={(e) => {
                    e.preventDefault();
                    sendEmail({variables: {data: email}})
                        .then(() => {
                            navigate("/");
                        })
                        .catch(console.error);
                }}
            >
                <span className={styles.text}>
                    Saisis ton email, tu recevras un lien pour modifier ton mot de passe.
                </span>
                <div className={styles.form_container}>
                    <label htmlFor="email" className={styles.input_label}>
                        <GradientInput
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={email.email}
                            onChange={(e) => setEmail({email: e.target.value})}
                        ></GradientInput>
                    </label>
                    {/*<button*/}
                    {/*    // className={"primaryButton"}*/}
                    {/*>Retour</button>*/}
                    <AnimatedButton
                        type="submit"
                        // style={{color: "white"}}
                        // className={"tertiaryButton"}
                        // onClick={() => toast("please check your email")}
                    >
                        Envoyer
                    </AnimatedButton>
                </div>
            </form>
        </div>
    )
}