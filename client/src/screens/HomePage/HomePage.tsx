import * as React from "react";
import { useEffect, useState } from "react";
import { HomePageProps } from "../../interfaces/Interfaces";
import styles from "./HomePage.module.css";
import {
  useGetProfileQuery,
  useLogoutMutation,
} from "../../gql/generated/schema";
import { LampContainer } from "../../components/ui/Lamp";
import { AnimatedButton } from "../../components/ui/Animated-button";
import Menu from "@mui/material/Menu";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import { NavLink, useNavigate } from "react-router-dom";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import { motion } from "framer-motion";
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

  const fetchImage = async () => {
    if (userProfile?.picture) {
      try {
        const response = await fetch(
          `http://localhost:4000/avatars/${userProfile.picture}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        // Update localStorage with fetched image
        localStorage.setItem("userImage", imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
  };

  useEffect(() => {
    // Vérifie d'abord s'il y a une image dans le local storage
    const storedImage = localStorage.getItem("userImage");
    if (storedImage) {
      setImageSrc(storedImage);
    } else if (userProfile?.picture) {
      // Si aucune image n'est trouvée dans le localStorage, on récupère depuis le back
      fetchImage();
    }
  }, [userProfile]);

  return (
    <div className={styles.homePage_container}>
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
      <div className={styles.buttons_container}>
        {!userIsLogged && (
          <>
            <NavLink to={"/sign-up"}>
              <AnimatedButton
                borderRadius="1.75rem"
                className="bg-slate-900 text-white border-slate-800"
              >
                Inscription
              </AnimatedButton>
            </NavLink>
            <NavLink to={"/login"}>
              <AnimatedButton
                borderRadius="1.75rem"
                className="bg-slate-900 text-white border-slate-800"
              >
                Connexion
              </AnimatedButton>
            </NavLink>
          </>
        )}
        {userIsLogged && (
          <>
            <NavLink to={"/matches"}>
              <AnimatedButton
                rx={"10%"}
                borderRadius="1.75rem"
                className="bg-slate-900 text-white border-slate-800"
              >
                Mes pronos
              </AnimatedButton>
            </NavLink>
            <NavLink to={"/pronos"}>
              <AnimatedButton
                rx={"80%"}
                borderRadius="1.75rem"
                className="bg-slate-900 text-white border-slate-800"
              >
                Tous les pronos
              </AnimatedButton>
            </NavLink>
            <NavLink to={"/classement"}>
              <AnimatedButton
                rx={"80%"}
                borderRadius="1.75rem"
                className="bg-slate-900 text-white border-slate-800"
              >
                Classement
              </AnimatedButton>
            </NavLink>
          </>
        )}
        {userIsLogged && user?.role === "admin" && (
          <NavLink to={"/admin"}>
            <AnimatedButton
              rx={"40%"}
              borderRadius="1.75rem"
              className="bg-slate-900 text-white border-slate-800"
            >
              Admin
            </AnimatedButton>
          </NavLink>
        )}
      </div>
    </div>
  );
}
