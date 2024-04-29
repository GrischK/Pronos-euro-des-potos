import { UserProfile, UsersListProps } from "../interfaces/Interfaces";
import { Dispatch } from "react";

export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", options);
}

export const handleCloseSnackbar = (
  setOpen: React.Dispatch<boolean>,
  event?: React.SyntheticEvent | Event,
  reason?: string,
) => {
  return () => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
};

export const fetchImage = async (
  userProfile: UserProfile | undefined,
  setImageSrc?: Dispatch<string | null>,
) => {
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
      if (setImageSrc) {
        setImageSrc(imageUrl);
        // localStorage.setItem("userImage", imageUrl);
      } else {
        return imageUrl;
      }
      // Update localStorage with fetched image
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }
};

export async function fetchUserImages(usersList: UserProfile[]) {
  const usersWithImages = await Promise.all(
    usersList.map(async (user: UserProfile) => {
      // console.log(user);
      if (user.picture) {
        const userImage = await fetchImage(user);
        return {
          id: user.id,
          name: user.userName,
          picture: userImage,
        };
      }
      return { id: user.id, name: user.userName, picture: undefined };
    }),
  );

  return usersWithImages.filter((user) => user !== null) as UsersListProps[];
}
