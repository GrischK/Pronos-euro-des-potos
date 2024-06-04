import {
  AllUsersPredictionInterface,
  MatchProps,
  UserProfile,
  UsersListProps,
} from "../interfaces/Interfaces";
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
        `${process.env.REACT_APP_GRAPHQL_API_URL}/avatars/${userProfile.picture}`,
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

export const points = (
  matchList: any[],
  allUsersPrediction: AllUsersPredictionInterface[],
  userId: number,
) => {
  let totalUserPoints = 0;

  return matchList.map((match: any) => {
    const userPredictions = allUsersPrediction?.filter(
      (pred) => pred?.user?.id === userId,
    );

    const matchUserPrediction = userPredictions?.find(
      (prediction: any) => prediction.matchId === match.id,
    );

    if (matchUserPrediction) {
      const matchResult = match.score;
      let myPoints = 0;

      const score = {
        prediction: matchUserPrediction,
        result: matchResult,
        matchId: match.id,
      };

      const winner = match.score.winner;
      let predictionWinner = "";

      if (
        score.prediction.homeTeamScorePrediction >
        score.prediction.awayTeamScorePrediction
      ) {
        predictionWinner = "HOME_TEAM";
      } else if (
        score.prediction.homeTeamScorePrediction <
        score.prediction.awayTeamScorePrediction
      ) {
        predictionWinner = "AWAY_TEAM";
      } else {
        predictionWinner = "DRAW";
      }

      if (predictionWinner === winner) {
        myPoints += 1;
      }

      if (
        score.prediction.homeTeamScorePrediction ===
          matchResult.fullTime.home &&
        score.prediction.awayTeamScorePrediction === matchResult.fullTime.away
      ) {
        myPoints += 2;

        // Vérifie si l'utilisateur est le seul à avoir trouvé le score exact
        const uniquePrediction = allUsersPrediction?.filter(
          (pred: any) =>
            pred.matchId === match.id &&
            pred.homeTeamScorePrediction === matchResult.fullTime.home &&
            pred.awayTeamScorePrediction === matchResult.fullTime.away,
          // pred.user.id !== userId, // Ne pas inclure la prédiction de l'utilisateur actuel
        );

        if (uniquePrediction && uniquePrediction.length === 1) {
          myPoints += 1; // Ajoute 1 point supplémentaires si l'utilisateur est le seul à avoir trouvé le score exact
        } else if (uniquePrediction && uniquePrediction.length > 1) {
          myPoints += 0; // Sinon 0 point ajouté
        }
      }

      totalUserPoints += myPoints;

      return {
        matchId: match.id,
        myPoints: myPoints,
        totalUserPoints: totalUserPoints,
      };
    }

    // Si aucune prédiction n'est trouvée pour ce match, retourner un objet undefined
    // pour ne pas afficher de points
    return {
      matchId: match.id,
      myPoints: undefined,
      totalUserPoints: totalUserPoints,
    };
  });
};

export const pointsForOneMatch = (
  match: MatchProps,
  allUsersPrediction: AllUsersPredictionInterface[],
  userId: number,
) => {
  const userPredictions = allUsersPrediction?.filter(
    (pred) => pred?.user?.id === userId,
  );

  const matchUserPrediction = userPredictions?.find(
    (prediction: any) => prediction.matchId === match.id,
  );

  if (matchUserPrediction) {
    const matchResult = match.score;
    let myPoints = 0;

    const score = {
      prediction: matchUserPrediction,
      result: matchResult,
      matchId: match.id,
    };

    const winner = match.score.winner;
    let predictionWinner = "";

    if (
      score.prediction.homeTeamScorePrediction >
      score.prediction.awayTeamScorePrediction
    ) {
      predictionWinner = "HOME_TEAM";
    } else if (
      score.prediction.homeTeamScorePrediction <
      score.prediction.awayTeamScorePrediction
    ) {
      predictionWinner = "AWAY_TEAM";
    } else {
      predictionWinner = "DRAW";
    }

    if (predictionWinner === winner) {
      myPoints += 1;
    }

    if (
      score.prediction.homeTeamScorePrediction === matchResult.fullTime.home &&
      score.prediction.awayTeamScorePrediction === matchResult.fullTime.away
    ) {
      myPoints += 2;

      // Vérifie si l'utilisateur est le seul à avoir trouvé le score exact
      const uniquePrediction = allUsersPrediction?.filter(
        (pred: any) =>
          pred.matchId === match.id &&
          pred.homeTeamScorePrediction === matchResult.fullTime.home &&
          pred.awayTeamScorePrediction === matchResult.fullTime.away,
        // pred.user.id !== userId, // Ne pas inclure la prédiction de l'utilisateur actuel
      );

      if (uniquePrediction && uniquePrediction.length === 1) {
        myPoints += 1; // Ajoute 1 point supplémentaires si l'utilisateur est le seul à avoir trouvé le score exact
      } else if (uniquePrediction && uniquePrediction.length > 1) {
        myPoints += 0; // Sinon 0 point ajouté
      }
    }

    return {
      matchId: match.id,
      myPoints: myPoints,
      userId: userId,
    };
  }

  // Si aucune prédiction n'est trouvée pour ce match, retourner un objet undefined
  // pour ne pas afficher de points
  return {
    matchId: match.id,
    myPoints: undefined,
    userId: userId,
  };
};
