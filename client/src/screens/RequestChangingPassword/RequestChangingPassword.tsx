import * as React from "react";
import { useState } from "react";
import styles from "./RequestChangingPassword.module.css";
import { useSendPasswordEmailMutation } from "../../gql/generated/schema";
import { GradientInput } from "../../components/ui/Gradient-input";
import { AnimatedButton } from "../../components/ui/Animated-button";
import { useNavigate } from "react-router-dom";
import { BackgroundBeams } from "../../components/ui/Background-beams";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import { Alert, Snackbar } from "@mui/material";
import { errorToast } from "../../utils/styles";

export default function RequestChangingPassword() {
  const [email, setEmail] = useState({
    email: "",
  });
  const [toastMessage, setToastMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = React.useState(false);

  const [sendEmail] = useSendPasswordEmailMutation();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendEmail({ variables: { data: email } })
      .then(() => {
        setToastMessage("E-mail envoyé.");
        setOpen(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((err: any) => {
        if (err.message === "Argument Validation Error") {
          setErrorMessage("8 caractères minimum pour le mot de passe.");
        } else {
          setErrorMessage(err.message);
        }
        setErrorOpen(true);
      });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
      <form className={styles.formBlock_container} onSubmit={handleSubmit}>
        <span className={styles.text}>
          Saisis ton email, tu recevras un lien pour modifier ton mot de passe.
        </span>
        <div className={styles.form_container}>
          <label htmlFor="email" className={styles.input_label}>
            <GradientInput
              required={true}
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
      {toastMessage && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={errorToast}>
            {toastMessage}
          </Alert>
        </Snackbar>
      )}
      {errorMessage && (
        <Snackbar
          open={errorOpen}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={errorToast}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
      {toastMessage && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={errorToast}>
            {toastMessage}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}
