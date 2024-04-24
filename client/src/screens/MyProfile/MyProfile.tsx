import React, {useEffect, useState} from "react";
import {ProfileProps} from "../../interfaces/Interfaces";
import styles from "./MyProfile.module.css"
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import {useNavigate} from "react-router-dom";
import {AnimatedButton} from "../../components/ui/Animated-button";
import {useUpdateUserMutation} from "../../gql/generated/schema";
import Modal from "@mui/material/Modal";
import {boxStyle, modalStyle} from "../../utils/styles";
import Box from "@mui/material/Box";
import UploadInput from "../../components/UploadInput/UploadInput";
import EditIcon from "@mui/icons-material/Edit";
import {GradientInput} from "../../components/ui/Gradient-input";

export default function MyProfile({userProfile, refreshUserProfile}: ProfileProps) {
    const [open, setOpen] = React.useState(false);
    const [usernameModal, setUsernameModal] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleUsernameModal = () => setUsernameModal(!usernameModal)
    const [image, setImage] = useState({
        preview: '',
        raw: new FormData(),
    });

    const [newUsername, setNewUsername] = React.useState('');

    const handleUsernameChange = (event: any) => {
        setNewUsername(event.target.value);
    };

    const [imageSrc, setImageSrc] = useState<null | string>(null);

    const [updateUser] = useUpdateUserMutation()

    const [fileName, setFileName] = useState('');

    const getFileInfo = (e: any) => {
        const formData = new FormData();
        setFileName(Date.now() + "_" + e.target.files[0].name.toString());
        formData.append('my-image-file', e.target.files[0], e.target.files[0].name);
        setImage({
            preview: URL.createObjectURL(e.target.files[0]),
            raw: formData,
        });
    }

    //TODO Delete previous image when posting new one

    const handleSubmit = (e: any) => {
        e.preventDefault()

        fetch('http://localhost:4000/image-upload', {
                method: 'POST',
                body: image.raw,
                headers: {
                    'FileName': fileName
                }
            }
        ).then(response => {
                console.log('POST request successful!', response)
                handleClose();
                refreshUserProfile();
            }
        );

        userProfile && updateUser({
            variables: {
                updateUserId: userProfile?.id,
                data: {
                    picture: fileName,
                }
            },
        });
    }

    const handleSubmitNewUsername = (e: any) => {
        e.preventDefault()

        userProfile && updateUser({
            variables: {
                updateUserId: userProfile?.id,
                data: {
                    userName: newUsername,
                }
            },
        }).then(response => {
            console.log(response)
            handleUsernameModal()
            refreshUserProfile();
        });

    }

    const navigate = useNavigate()
    const goBack = () => {
        navigate(-1);
    };


    const fetchImage = async () => {
        if (userProfile?.picture) {
            try {
                const response = await fetch(`http://localhost:4000/avatars/${userProfile.picture}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setImageSrc(imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }
    };

    useEffect(() => {
        if (userProfile?.picture) {
            fetchImage();
        }
    }, [userProfile]);

    console.log("filename is : ", fileName);
    console.log(userProfile)

    return (
        <div className={styles.myProfile_container}>
            <div className={"back_button"}>
                <ButtonHoverGradient
                    onClick={goBack}
                >
                    Retour
                </ButtonHoverGradient>
            </div>
            <div className={styles.title_container}>
                <h1 className={styles.title_slim}>
                    Mon
                </h1>
                <h1 className={styles.title}>&nbsp;profil</h1>
            </div>
            <div className={styles.myProfile_info}>
                <div className={styles.modifyUsername_container}>
                    <span>{userProfile?.userName}</span>
                    <EditIcon className={styles.modify_username} onClick={handleUsernameModal}/>
                </div>
                {imageSrc && <img className={styles.my_avatar} src={imageSrc} alt={`avatar_${userProfile?.userName}`}/>}
                <AnimatedButton onClick={handleOpen}>Ajouter / modifier mon image</AnimatedButton>
            </div>
            <Modal
                sx={modalStyle}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={boxStyle}>
                    {/*<Typography id="modal-modal-title" variant="h6" component="h2">*/}
                    {/*    Ajouter / modifier mon image*/}
                    {/*</Typography>*/}
                    <div id="modal-modal-description">
                        <form className={styles.uploadForm_container} onSubmit={handleSubmit}>
                            <UploadInput
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={getFileInfo}
                            />
                            {image.preview !== "" &&
                                <img className={styles.my_avatar}
                                     src={image.preview}
                                     alt={`avatar_${userProfile?.userName}`}
                                />
                            }
                            <AnimatedButton type="submit">
                                Envoyer
                            </AnimatedButton>
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
                    {/*<Typography id="modal-modal-title" variant="h6" component="h2">*/}
                    {/*    Ajouter / modifier mon image*/}
                    {/*</Typography>*/}
                    <div id="modal-modal-description">
                        <form className={styles.uploadForm_container} onSubmit={handleSubmitNewUsername}>
                            <label htmlFor="usernameInput">Nouveau nom d'utilisateur :</label>
                            {/*<input*/}
                            {/*    style={{color: 'black'}}*/}
                            {/*    type="text"*/}
                            {/*    id="usernameInput"*/}
                            {/*    value={newUsername}*/}
                            {/*    onChange={handleUsernameChange}*/}
                            {/*/>*/}
                            <GradientInput
                                id={"usernameInput"}
                                className={"font-bold text-2xl"}
                                type="text"
                                value={newUsername}
                                onChange={handleUsernameChange}
                            />
                            <AnimatedButton type="submit">
                                OK
                            </AnimatedButton>
                        </form>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}