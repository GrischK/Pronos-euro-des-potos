import * as React from "react";
import { useEffect, useState } from "react";
import { HomePageProps } from "../../interfaces/Interfaces";
import styles from "./HomePage.module.css";
import {
  useGetProfileQuery,
  useLogoutMutation,
} from "../../gql/generated/schema";
import { LampContainer } from "../../components/ui/Lamp";
import { fetchImage } from "../../utils/functions";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShimmerButton } from "../../components/ui/Shimmer-button/Shimmer-button";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function HomePage({ userProfile }: HomePageProps) {
  const { data: current, client } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  const userIsLogged = current?.profile?.id;
  const user = userProfile;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [imageSrc, setImageSrc] = useState<null | string>(null);

  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    const body = document.getElementsByTagName("body")[0];
    body.style.background = "0";
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("userImage");
    await client.resetStore();
    navigate("/");
  };

  // useEffect(() => {
  //   // Vérifie d'abord s'il y a une image dans le local storage
  //   const storedImage = localStorage.getItem("userImage");
  //   console.log("storedIMAGE is : ", storedImage);
  //   if (storedImage) {
  //       setImageSrc(storedImage);
  //   } else if (userProfile?.picture) {
  //   // Si aucune image n'est trouvée dans le localStorage, on récupère depuis le back
  //   fetchImage(userProfile, setImageSrc);
  //   }
  // }, [userProfile]);

  useEffect(() => {
    if (userProfile?.picture) {
      fetchImage(userProfile, setImageSrc);
    }
  }, [userProfile]);

  return (
    <div className={styles.homePage_container}>
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          <div className={styles.title_container}>
            <h1 className={styles.title}>Pronos</h1>
            <h1 className={styles.title_slim}>&nbsp;de l'Euro</h1>
          </div>
        </motion.h1>
      </LampContainer>
      {user && (
        <div className={styles.user_info}>
          {user.picture && imageSrc ? (
            <button
              className={styles.myPicture_container}
              onClick={handleClick}
            >
              <img
                className={styles.my_avatar}
                src={imageSrc}
                alt={`avatar_de_${user.userName}`}
              />
              {user.userName}
            </button>
          ) : (
            <ButtonHoverGradient onClick={handleClick}>
              <PersonPinIcon className={styles.user_icon} />
              {user.userName}
            </ButtonHoverGradient>
          )}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem>
              <NavLink to={"/profil"}>Mon profil</NavLink>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
          </Menu>
        </div>
      )}
      <div className={styles.buttons_container}>
        {!userIsLogged && (
          <>
            <NavLink to={"/sign-up"}>
              <ShimmerButton>Inscription</ShimmerButton>
            </NavLink>
            <NavLink to={"/login"}>
              <ShimmerButton>Connexion</ShimmerButton>
            </NavLink>
          </>
        )}
        {userIsLogged && (
          <>
            <NavLink to={"/tous-les-matches"}>
              <ShimmerButton>Mes Pronos</ShimmerButton>
            </NavLink>
            <NavLink to={"/tous-les-pronos"}>
              <ShimmerButton>Tous les pronos</ShimmerButton>
            </NavLink>
            <NavLink to={"/pronos-du-jour"}>
              <ShimmerButton>Pronos du jour</ShimmerButton>
            </NavLink>
            <NavLink to={"/classement"}>
              <ShimmerButton>Classement</ShimmerButton>
            </NavLink>
          </>
        )}
        {userIsLogged && user?.role === "admin" && (
          <NavLink to={"/admin"}>
            <ShimmerButton>Admin</ShimmerButton>
          </NavLink>
        )}
      </div>
    </div>
  );
}
