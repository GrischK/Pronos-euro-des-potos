import styles from "./SignUp.module.css";
import * as React from "react";
import { useState } from "react";
import {
  useCreateUserMutation,
  useLoginMutation,
} from "../../gql/generated/schema";
import { GradientInput } from "../../components/ui/Gradient-input";
import { AnimatedButton } from "../../components/ui/Animated-button";
import { useNavigate } from "react-router-dom";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import { handleCloseSnackbar } from "../../utils/functions";
import { BackgroundBeams } from "../../components/ui/Background-beams";
import { Alert, Snackbar } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { errorToast } from "../../utils/styles";

export default function SignUp() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    userName: "",
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = React.useState(false);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const [createUser] = useCreateUserMutation();

  const [login] = useLoginMutation();

  const togglePassword = () => setPasswordShown(!passwordShown);

  const handleClose = handleCloseSnackbar(setErrorOpen);

  return (
    <div className={styles.signUp_container}>
      <div className={"back_button"}>
        <ButtonHoverGradient onClick={goBack}>Retour</ButtonHoverGradient>
      </div>
      <div className={styles.title_container}>
        <h1 className={styles.signUp_title}>Inscri</h1>
        <h1 className={styles.signUp_title_slim}>ption</h1>
      </div>
      <form
        className={styles.signUp_form}
        onSubmit={(e) => {
          e.preventDefault();
          createUser({ variables: { data: userInfo } })
            .then(() => {
              login({
                variables: {
                  data: { email: userInfo.email, password: userInfo.password },
                },
              }).then(() => {
                navigate("/");
              });
            })
            .catch((err) => {
              if (err.message === "Argument Validation Error") {
                setErrorMessage("8 caractères minimum pour le mot de passe.");
              } else {
                setErrorMessage(err.message);
              }
              setErrorOpen(true);
            });
        }}
      >
        <label htmlFor="username">
          <GradientInput
            required={true}
            className={styles.signUp_input}
            type={"text"}
            id="username"
            placeholder="Pseudo"
            autoComplete={"off"}
            value={userInfo.userName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, userName: e.target.value })
            }
          />
        </label>
        <label htmlFor="email">
          <GradientInput
            required={true}
            className={styles.signUp_input}
            type="email"
            id={"email"}
            name={"email"}
            placeholder="Adresse mail"
            autoComplete={"off"}
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
          />
        </label>
        <label htmlFor="password" className={styles.relative_container}>
          <GradientInput
            required={true}
            className={styles.signUp_input}
            type={passwordShown ? "text" : "password"}
            id="password"
            placeholder="Mot de passe"
            autoComplete={"off"}
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={togglePassword}
            className={styles.show_password}
          >
            {passwordShown ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </button>
        </label>
        <AnimatedButton type="submit">Créer un compte</AnimatedButton>
      </form>
      <BackgroundBeams className={"z-1"} />
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
    </div>
  );
}
