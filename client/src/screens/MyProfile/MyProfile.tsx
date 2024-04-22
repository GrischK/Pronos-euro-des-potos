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
import Typography from "@mui/material/Typography";

export default function MyProfile({userProfile, refreshUserProfile}: ProfileProps) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [image, setImage] = useState({
        preview: '',
        raw: new FormData(),
    });

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

    const handleSubmit = (e: any) => {
        e.preventDefault()

        fetch('http://localhost:4000/image-upload', {
            method: 'POST',
            body: image.raw,
            headers: {
                'FileName': fileName
            }
        })
            .then(response => {
                console.log('POST request successful!', response)
                handleClose();
                refreshUserProfile();
            });

        userProfile && updateUser({
            variables: {
                updateUserId: userProfile?.id,
                data: {
                    picture: fileName,
                }
            },
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
            <div>
                <span>{userProfile?.userName}</span>
                {imageSrc && <img className={styles.my_avatar} src={imageSrc} alt={`avatar_${userProfile?.userName}`}/>}
                <button onClick={handleOpen}>clic</button>
                <h2>Ajouter / modifier mon avatar :</h2>
            </div>
            <Modal
                sx={modalStyle}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={boxStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Ajouter / modifier mon image
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        <form className={styles.uploadForm_container} onSubmit={handleSubmit}>
                            <input className={styles.upload_input} type="file" accept="image/png, image/jpeg"
                                   onChange={getFileInfo}/>
                            {image.preview !== "" &&
                                <img className={styles.my_avatar} src={image.preview}
                                     alt={`avatar_${userProfile?.userName}`}/>}
                            <AnimatedButton type="submit">
                                Envoyer
                            </AnimatedButton>
                        </form>
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}