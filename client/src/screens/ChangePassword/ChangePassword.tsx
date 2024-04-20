import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {useFetchTokenQuery, useChangePasswordMutation} from "../../gql/generated/schema";
import styles from "../ChangePassword/ChangePassword.module.css";
import {AnimatedButton} from "../../components/ui/Animated-button";
import * as React from "react";
import {GradientInput} from "../../components/ui/Gradient-input";
import {Boxes} from "../../components/ui/Background-boxes";
import {cn} from "../../utils/cn";

export default function ChangePassword() {
    const navigate = useNavigate();

    const [serverToken, setServerToken] = useState({});

    const {token, id} = useParams();

    const cleanId = id?.replace(/[:]+/g, "") ?? "0";
    console.log(cleanId)

    const [credentials, setCredentials] = useState({
        id: id ?? "",
        newPassword: "",
    });

    useFetchTokenQuery({
        // + turns string into number
        variables: {fetchTokenId: +cleanId},
        onCompleted: (response) => {
            //response back to client from server is the token saved in the database
            setServerToken(JSON.stringify(response.fetchToken.changePasswordToken));
        },
    });

    const [changePassword] = useChangePasswordMutation();

    const cleanServerToken = JSON.stringify(serverToken)
        .replace(/[\\]/g, "")
        .replace(/['"]+/g, "");
    const cleanToken = token?.replace(/[:]+/g, "");

    if (!token || cleanToken !== cleanServerToken)
        return (
            <div>
                {/* <img src={lost} alt="lost" /> */}
                <p>OOOPPS invalid token</p>
            </div>
        );
    return (
        <div className={styles.changePassword_container}>
            <div className={"back_button"}>
                <AnimatedButton
                    onClick={() => navigate("/")}
                >
                    Accueil
                </AnimatedButton>
            </div>
            <div className={styles.title_container}>
                <h1 className={styles.title}>
                    Nouveau
                </h1>
                <h1 className={styles.title_slim}>&nbsp;mot de passe</h1>
            </div>
            <form
                className={styles.changePassword_form}
                onSubmit={(e) => {
                    e.preventDefault();
                    changePassword({
                        variables: {
                            newPassword: credentials.newPassword,
                            changePasswordId: +credentials.id
                        }
                    })
                        .then(() => {
                            console.log("success");
                        })
                        .catch(console.error);
                }}
            >
                <span className={styles.text}>
                    Entre ton nouveau mot de passe.
                </span>
                <div className={styles.form_container}>
                    <label htmlFor="newPassword">
                        <GradientInput
                            // style={inputStyles}
                            // type={showPassword ? "text" : "password"}
                            id="newPassword"
                            placeholder="Nouveau mot de passe"
                            value={credentials.newPassword}
                            onChange={(e) =>
                                setCredentials({id: cleanId ?? "", newPassword: e.target.value})
                            }
                        ></GradientInput>
                        {/*<button type="button"*/}
                        {/*        onClick={togglePassword}>{showPassword ? "Hide password" : "Show password"}</button>*/}
                    </label>
                    <div>
                        {/*<button style={secondaryButtonStyles}>Retour</button>*/}
                        <AnimatedButton type="submit"
                            // style={primaryButtonStyles}
                        >
                            Valider
                        </AnimatedButton>
                    </div>
                </div>
            </form>
        </div>
    )
}