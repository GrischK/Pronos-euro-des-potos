import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./Ranking.module.css";
import { Spotlight } from "../../components/ui/Spotlight";
import {
  useGetAllPredictionsQuery,
  useGetAllUsersQuery,
} from "../../gql/generated/schema";
import { fetchUserImages } from "../../utils/functions";
import { UsersListProps } from "../../interfaces/Interfaces";

export default function Ranking() {
  const { data: allPredictions, refetch: refetchAllPredictions } =
    useGetAllPredictionsQuery();
  const { data: allUsers, refetch: refetchAllUsers } = useGetAllUsersQuery();

  const predictionsList = allPredictions && allPredictions?.getAllPredictions;
  const usersList = allUsers && allUsers?.getAllUsers;

  const [users, setUsers] = useState<UsersListProps[]>([]);

  useEffect(() => {
    async function fetchUsersWithImages() {
      if (usersList) {
        const usersWithImages = await fetchUserImages(usersList);
        setUsers(usersWithImages);
      }
    }

    fetchUsersWithImages();
  }, [usersList]);

  console.log(users);

  return (
    <div className={styles.ranking_container}>
      <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center antialiased relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          <div className={styles.title_container}>
            <h1 className={styles.title}>Classement</h1>
            <h1 className={styles.title_slim}>&nbsp;des potos</h1>
          </div>
        </div>
      </div>
      {users.map((user) => (
        <div key={user.id}>
          <span className={styles.userName}>{user.name}</span>
          {user.picture && (
            <img
              className={styles.my_avatar}
              src={user.picture}
              alt={user.name}
            />
          )}
        </div>
      ))}
    </div>
  );
}
