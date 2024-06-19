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
import { fetchUserImages, points } from "../../utils/functions";
import { StickyScrollRevealDemo } from "../../components/ui/Sticky-scroll-reveal-component";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { AnimatedTooltipPreview } from "../../components/ui/Animated-tooltip-preview";
import MilitaryTechRoundedIcon from "@mui/icons-material/MilitaryTechRounded";

export default function Ranking() {
  const { data: allPredictions, refetch: refetchAllPredictions } =
    useGetAllPredictionsQuery();
  const { data: allUsers, refetch: refetchAllUsers } = useGetAllUsersQuery();
  const { data: matches } = useFetchMatchesFromApiQuery();

  const predictionsList = allPredictions && allPredictions?.getAllPredictions;
  const usersList = allUsers && allUsers?.getAllUsers;

  const [users, setUsers] = useState<UsersListProps[]>([]);
  const matchList = matches && matches.fetchMatchesFromAPI;

  const [refresh, setRefresh] = useState(false);
  const [newRankingIsOpen, setNewRankingIsOpen] = useState(false);

  useEffect(() => {
    setRefresh(false);

    async function fetchUsersWithImages() {
      if (usersList && predictionsList) {
        const usersWithImages = await fetchUserImages(usersList);
        const updatedUsers = usersWithImages.map((user) => {
          if (predictionsList && matchList) {
            const userPoints = points(matchList, predictionsList, user.id);
            return {
              ...user,
              points: userPoints[userPoints.length - 1].totalUserPoints,
            };
          }
          return user;
        });
        setUsers(updatedUsers);
      }
    }

    refetchAllPredictions();
    refetchAllUsers();
    fetchUsersWithImages();
  }, [
    refresh,
    usersList,
    predictionsList,
    matchList,
    refetchAllPredictions,
    refetchAllUsers,
  ]);

  useEffect(() => {
    if (newRankingIsOpen) {
      hiddeNewRanking();
    } else {
      showNewRanking();
    }
  }, [newRankingIsOpen]);

  const sortedUsers = [...users]
    .sort((a, b) => (a.points || 0) - (b.points || 0))
    .reverse();

  const rankings: { [points: number]: number } = {};

  // On détermine la position dans le classement en fonction des points
  // Comme ça si les potos ont le même nombre de points, ils sont ex aequo dans le classement
  sortedUsers.forEach((contentInfo: any, index: number) => {
    const points = contentInfo.points;
    if (rankings[points] === undefined) {
      rankings[points] = index + 1;
    }
  });

  // Trouve les points correspondant au premier rang
  const topRankPoints = Object.keys(rankings).find(
    (key) => rankings[Number(key)] === 1,
  );

  // Filtrage des joueurs ayant les points correspondant au premier rang
  const topRankUsers = sortedUsers.filter(
    (user) => user.points && user.points === Number(topRankPoints),
  );

  // On crée un objet pour stocker les utilisateurs par leur position
  const usersByRank: { [rank: string]: UsersListProps[] } = {};

  sortedUsers.forEach((user) => {
    const rank = rankings[user.points ?? 0];
    const rankKey = `${rank}${rank === 1 ? "er" : "ème"} - ${user.points ?? 0}pt${user.points !== undefined && user.points > 1 ? "s" : ""}`;
    if (!usersByRank[rankKey]) {
      usersByRank[rankKey] = [];
    }
    usersByRank[rankKey].push(user);
  });

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
            {rank.includes("1er") ? (
              <h2 className="text-2xl font-bold text-slate-500 text-center">
                🏆 {rank} 🏆
              </h2>
            ) : rank.includes("2ème") ? (
              <h2 className="text-2xl font-bold text-slate-500 text-center">
                🥈 {rank} 🥈
              </h2>
            ) : rank.includes("3ème") ? (
              <h2 className="text-2xl font-bold text-slate-500 text-center">
                🥉 {rank} 🥉
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-slate-500 text-center">
                {" "}
                {rank}{" "}
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
                    alt={`${user.name} picture`}
                  />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {sortedUsers.length && (
        <StickyScrollRevealDemo contentData={sortedUsers} />
      )}
      <button onClick={() => setRefresh(true)} className={styles.refreshButton}>
        <RefreshRoundedIcon />
      </button>
    </div>
  );
}
