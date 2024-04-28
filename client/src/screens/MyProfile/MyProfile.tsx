import styles from "./MyProfile.module.css";
import React, { useEffect, useState } from "react";
import { ProfileProps } from "../../interfaces/Interfaces";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import { useNavigate } from "react-router-dom";
import { AnimatedButton } from "../../components/ui/Animated-button";
import { useUpdateUserMutation } from "../../gql/generated/schema";
import UploadInput from "../../components/UploadInput/UploadInput";
import { GradientInput } from "../../components/ui/Gradient-input";
import Modal from "@mui/material/Modal";
import { boxStyle, errorToast, modalStyle } from "../../utils/styles";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { fetchImage, handleCloseSnackbar } from "../../utils/functions";
import { Alert, Snackbar } from "@mui/material";

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
    const formData = new FormData();
    setFileName(Date.now() + "_" + e.target.files[0].name.toString());
    formData.append("my-image-file", e.target.files[0], e.target.files[0].name);
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: formData,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    fetch(`http://localhost:4000/avatars/${userProfile?.picture}`, {
      method: "DELETE",
    }).then((response) => {
      console.log("POST request successful!", response);
      fetch("http://localhost:4000/image-upload", {
        method: "POST",
        body: image.raw,
        headers: {
          FileName: fileName,
        },
      });

      handleClose();
      // Update localStorage with uploaded image
      localStorage.setItem("userImage", image.preview);
      console.log(refreshUserProfile);
      refreshUserProfile();
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
    const storedImage = localStorage.getItem("userImage");
    if (storedImage) {
      setImageSrc(storedImage);
    } else if (userProfile?.picture) {
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
        sx={modalStyle}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
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
        sx={modalStyle}
        open={usernameModal}
        onClose={handleUsernameModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
          <CloseRoundedIcon
            className={"closeIcon"}
            onClick={handleSubmitNewUsername}
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
    </div>
  );
}
