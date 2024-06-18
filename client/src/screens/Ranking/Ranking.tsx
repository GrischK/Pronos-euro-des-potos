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

  const sortedUsers = [...users]
    .sort((a, b) => (a.points || 0) - (b.points || 0))
    .reverse();

  const rankings: { [points: number]: number } = {};

  // On détermine la position dans le classement en fonction des points
  // Comme ça si les potos ont le même nombre de points, ils sont ex aequo dans le classment
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

  // Filtre les joueurs ayant les points correspondant au premier rang
  const topRankUsers = sortedUsers.filter(
    (user) => user.points && user.points === Number(topRankPoints),
  );

  return (
    <div className={styles.ranking_container}>
      <div className="h-[60vh] md:h-[40rem] w-full rounded-md flex md:items-center md:justify-center antialiased relative overflow-hidden flex-col">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-[6rem] md:pt-0">
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
      {sortedUsers.length && (
        <StickyScrollRevealDemo contentData={sortedUsers} />
      )}
      <button onClick={() => setRefresh(true)} className={styles.refreshButton}>
        <RefreshRoundedIcon />
      </button>
    </div>
  );
}
