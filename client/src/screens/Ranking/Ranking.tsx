import * as React from "react";
import { useEffect, useState } from "react";
import { UsersListProps } from "../../interfaces/Interfaces";
import styles from "./Ranking.module.css";
import {
  useFetchMatchesFromApiQuery,
  useGetAllPredictionsQuery,
  useGetAllUsersQuery,
} from "../../gql/generated/schema";
import {
  fetchUserImages,
  handleCloseSnackbar,
  points,
} from "../../utils/functions";
import { StickyScrollRevealDemo } from "../../components/ui/Sticky-scroll-reveal-component";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { AnimatedTooltipPreview } from "../../components/ui/Animated-tooltip-preview";
import { Alert, Snackbar } from "@mui/material";
import { errorToast } from "../../utils/styles";
import { AuroraBackground } from "../../components/ui/AuroraBackground";
import { NavLink } from "react-router-dom";
import { ShimmerButton } from "../../components/ui/Shimmer-button/Shimmer-button";
import { GoldenShimmerButton } from "../../components/ui/Golden-Shimmer-button/Golden-Shimmer-button";
import { FlipWords } from "../../components/ui/FlipWords";
import { motion } from "framer-motion";
import SparklesComponent from "../../components/SparklesComponent/SparklesComponent";

export default function Ranking() {
  const {
    data: allPredictions,
    refetch: refetchAllPredictions,
    error: errorAllPredictions,
  } = useGetAllPredictionsQuery();
  const {
    data: allUsers,
    refetch: refetchAllUsers,
    error: errorAllUsers,
  } = useGetAllUsersQuery();
  const {
    data: matches,
    refetch: refetchMatches,
    error: errorMatches,
  } = useFetchMatchesFromApiQuery({ errorPolicy: "ignore" });

  const predictionsList = allPredictions?.getAllPredictions;
  const usersList = allUsers?.getAllUsers;
  const matchList = matches?.fetchMatchesFromAPI;

  const [users, setUsers] = useState<UsersListProps[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [newRankingIsOpen, setNewRankingIsOpen] = useState(false);
  const [sortedUsers, setSortedUsers] = useState<UsersListProps[]>([]);
  const [topRankUsers, setTopRankUsers] = useState<UsersListProps[]>([]);
  const [usersByRank, setUsersByRank] = useState<{
    [rank: string]: UsersListProps[];
  }>({});
  const [errorApi, setErrorApi] = useState(false);

  useEffect(() => {
    const fetchUsersWithImages = async () => {
      if (usersList && predictionsList && matchList) {
        const usersWithImages = await fetchUserImages(usersList);
        const updatedUsers = usersWithImages.map((user) => {
          const userPoints = points(matchList, predictionsList, user.id);
          return {
            ...user,
            points: userPoints[userPoints.length - 1]?.totalUserPoints ?? 0,
          };
        });
        setUsers(updatedUsers);
      }
    };

    refetchAllPredictions();
    refetchAllUsers();
    fetchUsersWithImages();
    setRefresh(false);
  }, [
    refresh,
    usersList,
    predictionsList,
    matchList,
    refetchAllPredictions,
    refetchAllUsers,
  ]);

  useEffect(() => {
    const calculateRankings = () => {
      if (users.length === 0) return;

      const sorted = [...users]
        .sort((a, b) => (a.points || 0) - (b.points || 0))
        .reverse();
      const rankings: { [points: number]: number } = {};

      sorted.forEach((contentInfo, index) => {
        const points = contentInfo.points ?? 0; // Assign a default value of 0 if points is undefined
        if (rankings[points] === undefined) {
          rankings[points] = index + 1;
        }
      });

      const topRankPoints = Object.keys(rankings).find(
        (key) => rankings[Number(key)] === 1,
      );

      const topRank = sorted.filter(
        (user) => user.points && user.points === Number(topRankPoints),
      );

      const usersByRank: { [rank: string]: UsersListProps[] } = {};

      sorted.forEach((user) => {
        const rank = rankings[user.points ?? 0];
        const rankKey = `${rank}${rank === 1 ? "er" : "ème"} - ${
          user.points ?? 0
        }pt${user.points !== undefined && user.points > 1 ? "s" : ""}`;
        if (!usersByRank[rankKey]) {
          usersByRank[rankKey] = [];
        }
        usersByRank[rankKey].push(user);
      });

      setSortedUsers(sorted);
      setTopRankUsers(topRank);
      setUsersByRank(usersByRank);
      setRefresh(false);
    };
    refetchMatches().then((r) => {
      calculateRankings();
    });

    calculateRankings();
  }, [users, matchList, refresh, refetchMatches]);

  useEffect(() => {
    if (newRankingIsOpen) {
      showNewRanking();
    } else {
      hiddeNewRanking();
    }
  }, [newRankingIsOpen]);

  const hiddeNewRanking = () => {
    const ranking = document.getElementById("newRanking_container");
    if (ranking) {
      ranking.classList.remove("show");
    }
  };

  const showNewRanking = () => {
    const ranking = document.getElementById("newRanking_container");
    if (ranking) {
      ranking.classList.add("show");
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleCloseSnack = handleCloseSnackbar(setOpen);
  const handleErrorApiSnack = handleCloseSnackbar(setErrorApi);

  const refreshHandle = () => {
    setOpen(true);
    setRefresh(true);
  };

  // Log pour les erreurs Apollo
  useEffect(() => {
    if (errorAllPredictions) {
      console.error("Error fetching predictions:", errorAllPredictions);
    }
    if (errorAllUsers) {
      console.error("Error fetching users:", errorAllUsers);
    }
    if (errorMatches) {
      console.error("Error fetching matches:", errorMatches);
    }
  }, [errorAllPredictions, errorAllUsers, errorMatches]);

  const createGameButtonVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        delay: 1.5,
        duration: 1.5,
        type: "spring",
        stiffness: 300,
        damping: 8,
      },
    },
  };

  const crownTransition = {
    duration: 4,
    ease: [0, 0.71, 0.2, 1.01],
    type: "spring",
    damping: 11,
    stiffness: 100,
    mass: 0.5,
    restDelta: 0.001,
    delay: 3,
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (matchList === undefined) {
        setErrorApi(true);
      }
    }, 1500); // Délai de 1,5 secondes avant de checker si y'a un problème avec l'API des matchs

    return () => clearTimeout(timerId);
  }, [matchList]);

  return (
    <div className={styles.ranking_container}>
      <AuroraBackground>
        {/*Remove overflow-hidden for sparkles, check if needed*/}
        <div className="h-[60vh] md:h-[40rem] w-full rounded-md flex md:items-center md:justify-center antialiased relative flex-col items-center">
          <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-[6rem] md:pt-0">
            <div className={styles.title_container}>
              <h1 className={styles.title}>Classement</h1>
              <h1 className={styles.title_slim}>&nbsp;des potos</h1>
            </div>
          </div>
          <SparklesComponent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={crownTransition}
              className={styles.champion_container}
            >
              <span>👑</span>
            </motion.div>
            <motion.div
              style={{ height: "60px" }}
              variants={createGameButtonVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatedTooltipPreview champions={topRankUsers} />
            </motion.div>
          </SparklesComponent>
        </div>
      </AuroraBackground>
      <div className={styles.displayRanking_button}>
        <GoldenShimmerButton
          className={"min-w-60"}
          onClick={() => setNewRankingIsOpen(!newRankingIsOpen)}
        >
          <FlipWords
            className={"text-[goldenrod] "}
            words={["Classement", "emoji"]}
          />
        </GoldenShimmerButton>
      </div>
      <div
        className={"rank_container"}
        style={{ color: "white" }}
        id={"newRanking_container"}
      >
        {Object.keys(usersByRank).map((rank) => (
          <div className={styles.rank} key={rank}>
            {rank.split("-")[0].trim() === "1er" ? (
              <h2 className="text-2xl font-bold text-slate-500 text-center">
                🏆 {rank} 🏆
              </h2>
            ) : rank.split("-")[0].trim() === "2ème" ? (
              <h2 className="text-2xl font-bold text-slate-500 text-center">
                🥈 {rank} 🥈
              </h2>
            ) : rank.split("-")[0].trim() === "3ème" ? (
              <h2 className="text-2xl font-bold text-slate-500 text-center">
                🥉 {rank} 🥉
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-slate-500 text-center">
                {rank}
              </h2>
            )}
            <div className="flex justify-center gap-1 flex-wrap">
              {usersByRank[rank].map((user) => (
                <div
                  className="text-center flex flex-col items-center font-bold text-slate-100 pb-1"
                  key={user.id}
                >
                  <img
                    className={styles.rank_userPicture}
                    src={user.picture ? user.picture : "/husky.png"}
                    alt={`${user.name}`}
                  />
                  <span className="max-w-20 text-wrap">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pronosOfTheDay}>
        <NavLink to={"/matchs-du-jour"}>
          <ShimmerButton>Matchs du jour</ShimmerButton>
        </NavLink>
      </div>
      {sortedUsers.length > 0 && (
        <StickyScrollRevealDemo contentData={sortedUsers} />
      )}
      <button onClick={refreshHandle} className={styles.refreshButton}>
        <RefreshRoundedIcon />
      </button>
      {open && (
        <Snackbar
          open={open}
          autoHideDuration={1500}
          onClose={handleCloseSnack}
        >
          <Alert onClose={handleCloseSnack} severity="success" sx={errorToast}>
            Mis à jour
          </Alert>
        </Snackbar>
      )}
      {errorApi && (
        <Snackbar
          open={errorApi}
          autoHideDuration={5000}
          onClose={handleErrorApiSnack}
        >
          <Alert onClose={handleErrorApiSnack} severity="error" sx={errorToast}>
            Problème avec la récupération des données. Reviens dans 1 minute et
            rafraichis la page !
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}
