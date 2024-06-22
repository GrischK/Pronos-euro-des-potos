import * as React from "react";
import { useEffect, useState } from "react";
import { UsersListProps } from "../../interfaces/Interfaces";
import styles from "./Ranking.module.css";
import { Spotlight } from "../../components/ui/Spotlight";
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
import MilitaryTechRoundedIcon from "@mui/icons-material/MilitaryTechRounded";
import { Alert, Snackbar } from "@mui/material";
import { errorToast } from "../../utils/styles";

export default function Ranking() {
  const { data: allPredictions, refetch: refetchAllPredictions } =
    useGetAllPredictionsQuery();
  const { data: allUsers, refetch: refetchAllUsers } = useGetAllUsersQuery();
  const { data: matches } = useFetchMatchesFromApiQuery();

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

    calculateRankings();
  }, [users, matchList, refresh]);

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

  const refreshHandle = () => {
    setOpen(true);
    setRefresh(true);
  };

  return (
    <div className={styles.ranking_container}>
      <div className="h-[60vh] md:h-[40rem] w-full rounded-md flex md:items-center md:justify-center antialiased relative overflow-hidden flex-col">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-[6rem] md:pt-0">
          <div className={styles.title_container}>
            <h1 className={styles.title}>Classement</h1>
            <h1 className={styles.title_slim}>&nbsp;des potos</h1>
          </div>
        </div>
        <div className={styles.champion_container}>
          <span>👑</span>
        </div>

        <AnimatedTooltipPreview champions={topRankUsers} />
      </div>
      <button
        onClick={() => setNewRankingIsOpen(!newRankingIsOpen)}
        className={styles.displayRanking_button}
      >
        <MilitaryTechRoundedIcon />
      </button>
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
    </div>
  );
}
