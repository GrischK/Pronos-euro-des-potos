import * as React from "react";
import { useState } from "react";
import styles from "./RequestChangingPassword.module.css";
import { useSendPasswordEmailMutation } from "../../gql/generated/schema";
import { GradientInput } from "../../components/ui/Gradient-input";
import { AnimatedButton } from "../../components/ui/Animated-button";
import { useNavigate } from "react-router-dom";
import { BackgroundBeams } from "../../components/ui/Background-beams";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";

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
        <ButtonHoverGradient onClick={goBack}>Retour</ButtonHoverGradient>
      </div>
      <div className={styles.title_container}>
        <h1 className={styles.title}>Nouveau</h1>
        <h1 className={styles.title_slim}>&nbsp;mot de passe</h1>
      </div>
      <form
        className={styles.formBlock_container}
        onSubmit={(e) => {
          e.preventDefault();
          sendEmail({ variables: { data: email } })
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
              onChange={(e) => setEmail({ email: e.target.value })}
            ></GradientInput>
          </label>
          <AnimatedButton type="submit">Envoyer</AnimatedButton>
        </div>
      </form>
      <BackgroundBeams className={"z-1"} />
    </div>
  );
}
