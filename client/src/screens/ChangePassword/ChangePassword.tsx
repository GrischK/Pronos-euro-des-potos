import * as React from "react";
import { useState } from "react";
import styles from "../ChangePassword/ChangePassword.module.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  useChangePasswordMutation,
  useFetchTokenQuery,
} from "../../gql/generated/schema";
import { AnimatedButton } from "../../components/ui/Animated-button";
import { GradientInput } from "../../components/ui/Gradient-input";
import { BackgroundBeams } from "../../components/ui/Background-beams";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [serverToken, setServerToken] = useState({});

  const { token, id } = useParams();

  const cleanId = id?.replace(/[:]+/g, "") ?? "0";
  console.log(cleanId);

  const [credentials, setCredentials] = useState({
    id: id ?? "",
    newPassword: "",
  });

  useFetchTokenQuery({
    // + turns string into number
    variables: { fetchTokenId: +cleanId },
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    changePassword({
      variables: {
        newPassword: credentials.newPassword,
        changePasswordId: +credentials.id,
      },
    })
      .then(() => {
        console.log("success");
      })
      .catch(console.error);
    navigate("/");
  };

  if (!token || cleanToken !== cleanServerToken)
    return (
      <div>
        <p>OOOPPS invalid token</p>
      </div>
    );
  return (
    <div className={styles.changePassword_container}>
      <div className={"back_button"}>
        <ButtonHoverGradient onClick={() => navigate("/")}>
          Accueil
        </ButtonHoverGradient>
      </div>
      <div className={styles.title_container}>
        <h1 className={styles.title}>Nouveau</h1>
        <h1 className={styles.title_slim}>&nbsp;mot de passe</h1>
      </div>
      <form className={styles.changePassword_form} onSubmit={handleSubmit}>
        <span className={styles.text}>Entre ton nouveau mot de passe.</span>
        <div className={styles.form_container}>
          <label htmlFor="newPassword">
            <GradientInput
              id="newPassword"
              placeholder="Nouveau mot de passe"
              value={credentials.newPassword}
              onChange={(e) =>
                setCredentials({
                  id: cleanId ?? "",
                  newPassword: e.target.value,
                })
              }
            ></GradientInput>
          </label>
          <div>
            <AnimatedButton type="submit">Valider</AnimatedButton>
          </div>
        </div>
      </form>
      <BackgroundBeams className={"z-1"} />
    </div>
  );
}
