import {
  AllUsersPredictionInterface,
  MatchProps,
  TeamNames,
  UserProfile,
  UsersListProps,
} from "../interfaces/Interfaces";
import React, { Dispatch } from "react";
import { format } from "date-fns";
import teamNames from "../teamNames.json";

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

export const formatTime = (dateString: string) => {
  return format(dateString, "HH:mm");
};

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
      let matchResult: any;
      let myPoints = 0;

      // Vérifiez d'abord le score de regularTime, sinon utilisez fullTime
      if (
        match.score.regularTime &&
        match.score.regularTime.home !== undefined &&
        match.score.regularTime.home !== null // Ajout de la vérification pour null
      ) {
        matchResult = match.score.regularTime;
      } else if (
        match.score.fullTime &&
        match.score.fullTime.home !== undefined &&
        match.score.fullTime.home !== null // Ajout de la vérification pour null
      ) {
        matchResult = match.score.fullTime;
      } else {
        matchResult = null; // Aucun score disponible
      }

      // Si le matchResult est null, cela signifie que le match n'a pas été joué
      if (matchResult === null) {
        return {
          matchId: match.id,
          myPoints: undefined,
          totalUserPoints: totalUserPoints,
        };
      }

      const score = {
        prediction: matchUserPrediction,
        result: matchResult,
        matchId: match.id,
      };

      // Déterminer le gagnant basé sur matchResult
      let winner = "";
      if (matchResult.home > matchResult.away) {
        winner = "HOME_TEAM";
      } else if (matchResult.home < matchResult.away) {
        winner = "AWAY_TEAM";
      } else {
        winner = "DRAW";
      }

      // Déterminer le gagnant basé sur la prédiction de l'utilisateur
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

      // 1 point si le résultat (gagnant, perdant, match nul) est correct
      if (predictionWinner === winner) {
        myPoints += 1;
      }

      // Vérification pour le score exact
      const isExactScore =
        score.prediction.homeTeamScorePrediction === matchResult.home &&
        score.prediction.awayTeamScorePrediction === matchResult.away;

      if (isExactScore) {
        myPoints += 2; // Ajouter 2 points pour un score exact (total de 3 avec le point précédent)

        // Vérifie si l'utilisateur est le seul à avoir trouvé le score exact
        const uniquePrediction = allUsersPrediction?.filter(
          (pred: any) =>
            pred.matchId === match.id &&
            pred.homeTeamScorePrediction === matchResult.home &&
            pred.awayTeamScorePrediction === matchResult.away,
        );

        if (uniquePrediction && uniquePrediction.length === 1) {
          myPoints += 1; // Ajouter 1 point supplémentaire si l'utilisateur est le seul à avoir trouvé le score exact
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
    let matchResult: any;
    let myPoints = 0;

    // Vérifiez d'abord le score de regularTime, sinon utilisez fullTime
    if (
      match.score?.regularTime &&
      match.score.regularTime.home !== undefined
    ) {
      matchResult = match.score.regularTime;
    } else {
      matchResult = match.score?.fullTime;
    }

    const score = {
      prediction: matchUserPrediction,
      result: matchResult,
      matchId: match.id,
    };

    // Déterminer le gagnant basé sur matchResult
    let winner = "";
    if (matchResult.home > matchResult.away) {
      winner = "HOME_TEAM";
    } else if (matchResult.home < matchResult.away) {
      winner = "AWAY_TEAM";
    } else {
      winner = "DRAW";
    }

    // Déterminer le gagnant basé sur la prédiction de l'utilisateur
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

    // 1 point si le résultat (gagnant, perdant, match nul) est correct
    if (predictionWinner === winner) {
      myPoints += 1;
    }

    // Vérification pour le score exact
    const isExactScore =
      score.prediction.homeTeamScorePrediction === matchResult.home &&
      score.prediction.awayTeamScorePrediction === matchResult.away;

    if (isExactScore) {
      myPoints += 2; // Ajouter 2 points pour un score exact (total de 3 avec le point précédent)

      // Vérifie si l'utilisateur est le seul à avoir trouvé le score exact
      const uniquePrediction = allUsersPrediction?.filter(
        (pred: any) =>
          pred.matchId === match.id &&
          pred.homeTeamScorePrediction === matchResult.home &&
          pred.awayTeamScorePrediction === matchResult.away,
      );

      if (uniquePrediction && uniquePrediction.length === 1) {
        myPoints += 1; // Ajouter 1 point supplémentaire si l'utilisateur est le seul à avoir trouvé le score exact
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

export const getCurrentDateString = () => {
  const today = new Date();
  console.log("today's date is : ", today);
  return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};

// export const getCurrentDateWithTimeString = () => {
//   const today = new Date();
//   return today.toLocaleTimeString();
// };

export const getCurrentDateString2 = () => {
  const today = new Date();

  // Ajoute 2 heures car le serveur semble être calé sur UTC
  today.setHours(today.getHours() + 2);
  console.log("Today's date +2h is: ", today);

  // Retourner la date ajustée au format YYYY-MM-DD
  return today.toISOString().split("T")[0];
};

export function formatGroupName(groupName: string) {
  return groupName.replace("GROUP_", "GROUPE ");
}

export function formatStageName(stage: string) {
  if (stage === "LAST_16") {
    return stage.replace("LAST_16", "8ème");
  } else if (stage === "QUARTER_FINALS") {
    return stage.replace("QUARTER_FINALS", "Quart");
  } else if (stage === "SEMI_FINALS") {
    return stage.replace("SEMI_FINALS", "Demi-finale");
  } else if (stage === "FINAL") {
    return stage.replace("FINAL", "Finale");
  } else {
    return stage;
  }
}

const teamNamesTyped: TeamNames = teamNames as TeamNames;

export const getTranslatedName = (teamName: string): string => {
  return teamNamesTyped[teamName] || teamName;
};

export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

const defaultColor = "hsl(50deg, 100%, 50%)";

// Function that will create a new sparkle instance
export const generateSparkle = (color = defaultColor) => {
  return {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),

    // Bright yellow color by default
    color,
    size: random(10, 20),
    style: {
      top: random(-50, 100) + "%",
      left: random(-50, 100) + "%",
      zIndex: 2,
    },
  };
};

// Function for random number generation for interval sparkles apparition
export const useRandomInterval = (
  callback: () => void,
  minDelay: number,
  maxDelay: number,
): (() => void) => {
  const timeoutId = React.useRef<number | null>(null);
  const savedCallback = React.useRef<() => void>(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const handleTick = () => {
      const nextTickAt = random(minDelay, maxDelay);
      timeoutId.current = window.setTimeout(() => {
        savedCallback.current();
        handleTick();
      }, nextTickAt);
    };
    handleTick();
    return () => {
      if (timeoutId.current !== null) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, [minDelay, maxDelay]);

  const cancel = React.useCallback(() => {
    if (timeoutId.current !== null) {
      window.clearTimeout(timeoutId.current);
    }
  }, []);

  return cancel;
};

// Create a range for example to determine the sparkles number
export const range = (start: number, end?: number, step = 1) => {
  let output = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export const validateInput = (value: string) => {
  const number = Number(value);
  return isNaN(number) ? 0 : number;
};
