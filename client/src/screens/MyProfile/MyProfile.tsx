import styles from "./MyProfile.module.css";
import React, { useEffect, useState } from "react";
import { MatchProps, ProfileProps } from "../../interfaces/Interfaces";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import { useNavigate } from "react-router-dom";
import { AnimatedButton } from "../../components/ui/Animated-button";
import {
  useGetAllPredictionsQuery,
  useUpdateUserMutation,
} from "../../gql/generated/schema";
import UploadInput from "../../components/UploadInput/UploadInput";
import { GradientInput } from "../../components/ui/Gradient-input";
import { fetchImage, handleCloseSnackbar } from "../../utils/functions";
import { Alert, Snackbar } from "@mui/material";
import Modal from "@mui/material/Modal";
import { boxStyle, errorToast, modalStyle } from "../../utils/styles";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import data from "../../matches.json";

export default function MyProfile({
  userProfile,
  refreshUserProfile,
}: ProfileProps) {
  const [open, setOpen] = React.useState(false);
  const [usernameModal, setUsernameModal] = React.useState(false);
  const [newUsername, setNewUsername] = React.useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [image, setImage] = useState({
    preview: "",
    raw: new FormData(),
  });
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [fileName, setFileName] = useState("");

  const { data: allPredictions, refetch } = useGetAllPredictionsQuery();

  const matchList: MatchProps[] = data;

  const predictionsList = allPredictions && allPredictions?.getAllPredictions;

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUsernameModal = () => setUsernameModal(!usernameModal);

  const handleUsernameChange = (event: any) => {
    setNewUsername(event.target.value);
  };

  const [updateUser] = useUpdateUserMutation();

  const getFileInfo = (e: any) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      // Affiche un message d'erreur si la taille dépasse 5 Mo
      setErrorMessage("La taille de l'image dépasse 5 Mo.");
      setErrorOpen(true);
    } else {
      // Si la taille est Ok on continue
      const formData = new FormData();
      setFileName(Date.now() + "_" + file.name.toString());
      formData.append("my-image-file", file, file.name);
      setImage({
        preview: URL.createObjectURL(file),
        raw: formData,
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Si aucune photo n'a été sélectionnée, affiche un message d'erreur
    if (!image.raw.has("my-image-file")) {
      setErrorMessage("Choisis une photo.");
      setErrorOpen(true);
      return;
    }

    fetch(
      `${process.env.REACT_APP_GRAPHQL_API_URL}/avatars/${userProfile?.picture}`,
      {
        method: "DELETE",
      },
    ).then(() => {
      fetch(`${process.env.REACT_APP_GRAPHQL_API_URL}/image-upload`, {
        method: "POST",
        body: image.raw,
        headers: {
          FileName: fileName,
        },
      }).then(() => {
        handleClose();
        // Update localStorage with uploaded image
        // localStorage.setItem("userImage", image.preview);
        refreshUserProfile();
      });
    });

    userProfile &&
      updateUser({
        variables: {
          updateUserId: userProfile?.id,
          data: {
            picture: fileName,
          },
        },
      });
  };

  const handleCloseError = handleCloseSnackbar(setErrorOpen);

  const handleSubmitNewUsername = (e: any) => {
    e.preventDefault();

    userProfile &&
      updateUser({
        variables: {
          updateUserId: userProfile?.id,
          data: {
            userName: newUsername,
          },
        },
      })
        .then(() => {
          handleUsernameModal();
          refreshUserProfile();
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setErrorOpen(true);
        });
  };

  useEffect(() => {
    // Vérifie d'abord s'il y a une image dans le local storage
    // const storedImage = localStorage.getItem("userImage");
    // if (storedImage) {
    //   setImageSrc(storedImage);
    // } else
    if (userProfile?.picture) {
      // Si aucune image n'est trouvée dans le localStorage, on récupère depuis le back
      fetchImage(userProfile, setImageSrc);
    }
  }, [userProfile]);

  return (
    <div className={styles.myProfile_container}>
      <div className={"back_button"}>
        <ButtonHoverGradient onClick={goBack}>Retour</ButtonHoverGradient>
      </div>
      <div className={styles.title_container}>
        <h1 className={styles.title_slim}>Mon</h1>
        <h1 className={styles.title}>&nbsp;profil</h1>
      </div>
      <div className={styles.myProfile_info}>
        <div className={styles.modifyUsername_container}>
          <span>{userProfile?.userName}</span>
          <EditIcon
            className={styles.modify_username}
            onClick={handleUsernameModal}
          />
        </div>
        {imageSrc && (
          <img
            className={styles.my_avatar}
            src={imageSrc}
            alt={`avatar_${userProfile?.userName}`}
          />
        )}
        <AnimatedButton onClick={handleOpen}>
          Ajouter / modifier mon image
        </AnimatedButton>
      </div>
      <Modal
        className={styles.myProfile_modal}
        sx={modalStyle}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle} className={styles.myProfile_modalBox}>
          <CloseRoundedIcon className={"closeIcon"} onClick={handleClose} />
          <div id="modal-modal-description">
            <form
              className={styles.uploadForm_container}
              onSubmit={handleSubmit}
            >
              <UploadInput
                type="file"
                accept="image/png, image/jpeg"
                onChange={getFileInfo}
              />
              {image.preview !== "" && (
                <img
                  className={styles.my_avatar}
                  src={image.preview}
                  alt={`avatar_${userProfile?.userName}`}
                />
              )}
              <AnimatedButton type="submit">Envoyer</AnimatedButton>
            </form>
          </div>
        </Box>
      </Modal>
      <Modal
        className={styles.myProfile_modal}
        sx={modalStyle}
        open={usernameModal}
        onClose={handleUsernameModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle} className={styles.myProfile_modalBox}>
          <CloseRoundedIcon
            className={"closeIcon"}
            onClick={handleUsernameModal}
          />
          <div id="modal-modal-description">
            <form
              className={styles.uploadForm_container}
              onSubmit={handleSubmitNewUsername}
            >
              <label htmlFor="usernameInput">Nouveau nom d'utilisateur :</label>
              <GradientInput
                id={"usernameInput"}
                placeholder={"Pseudo"}
                className={"font-bold text-2xl"}
                type="text"
                value={newUsername}
                onChange={handleUsernameChange}
              />
              <AnimatedButton type="submit">OK</AnimatedButton>
            </form>
          </div>
        </Box>
      </Modal>
      {errorMessage && (
        <Snackbar
          open={errorOpen}
          autoHideDuration={6000}
          onClose={handleCloseError}
        >
          <Alert onClose={handleCloseError} severity="error" sx={errorToast}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
      {matchList && (
        <div className={styles.myProfile_predictionsMissed}>
          {matchList.map((match) => {
            // Filtre les pronos pour ce match
            const matchPredictions = predictionsList?.filter(
              (prediction: any) => prediction.matchId === match.id,
            );
            // Vérifie si l'utilisateur a fait un prono pour ce match
            const userPredictions = matchPredictions?.filter(
              (prediction: any) => prediction.user.id === userProfile?.id,
            );
            // Si l'utilisateur n'a pas fait de prono, on lui notifie
            if (!userPredictions || userPredictions?.length === 0) {
              return (
                <div key={match.id} className={styles.myProfile_matchInfo}>
                  <span>{match.stage}</span>

                  <div className={styles.myProfile_matchInfo_details}>
                    <span>{match.homeTeam.name}</span>
                    <div className={styles.myProfile_matchInfo_flags}>
                      {match.homeTeam.crest && match.homeTeam.name && (
                        <img
                          src={match.homeTeam.crest}
                          alt={match.homeTeam.name}
                        />
                      )}
                      <span> - </span>
                      {match.awayTeam.crest && match.awayTeam.name && (
                        <img
                          src={match.awayTeam.crest}
                          alt={match.awayTeam.name}
                        />
                      )}
                    </div>
                    <span>{match.awayTeam.name}</span>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
