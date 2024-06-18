import * as React from "react";
import { useEffect, useState } from "react";
import { PronosProps } from "../../interfaces/Interfaces";
import styles from "./Pronos.module.css";
import {
  useFetchMatchesFromApiQuery,
  useGetAllPredictionsQuery,
} from "../../gql/generated/schema";
import { MeteorCard } from "../../components/ui/Meteor-card";
import Loader from "../../components/Loader/Loader";
import { SparklesCore } from "../../components/ui/Sparkles";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { NavLink } from "react-router-dom";
import { ShimmerButton } from "../../components/ui/Shimmer-button/Shimmer-button";
// import data from "../../matches.json";

export default function Pronos({ refetchPronos, userId }: PronosProps) {
  const { data: allPredictions, refetch } = useGetAllPredictionsQuery();
  const { data: matches, refetch: refetchMatches } =
    useFetchMatchesFromApiQuery();
  const matchList = matches && matches.fetchMatchesFromAPI;

  const [filter, setFilter] = useState<string>();
  console.log(matchList);
  // const matchList = data;

  const predictionsList = allPredictions && allPredictions?.getAllPredictions;

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setRefresh(false);
    refetchMatches();
    refetch();
  }, [refresh, refetchPronos, refetch, refetchMatches]);

  const filterMatchesByStage = (matches: any, stage: any) => {
    return matches.filter((match: any) => match.stage === stage);
  };

  return (
    <div className={styles.pronos_container}>
      <div
        style={{ background: "#020617" }}
        className="w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md"
      >
        <div className={styles.title_container}>
          <h1 className={styles.title}>Les Pronos</h1>
          <h1 className={styles.title_slim}>&nbsp;des potos</h1>
        </div>
        <div className="w-[40rem] h-40 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background={"transparent"}
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div
            style={{ background: "#020617" }}
            className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"
          ></div>
        </div>
      </div>
      <div className={styles.pronosOfTheDay}>
        <NavLink to={"/pronos-du-jour"}>
          <ShimmerButton>Pronos du jour</ShimmerButton>
        </NavLink>
      </div>

      <div className={styles.filter_container}>
        <label htmlFor="stage">Filtrer les matchs</label>
        <select
          className="bg-slate-800 text-white text-xl"
          onChange={(e) =>
            e.target.value === "undefined"
              ? setFilter(undefined)
              : setFilter(e.target.value)
          }
          // style={{ width: "20vw", minWidth: "150px" }}
          name="matches stages"
          id="stage"
        >
          <option value="undefined">Tous les matchs</option>
          <option value="GROUP_STAGE">Matchs de poule</option>
          <option value="LAST_16">8èmes de finale</option>
          <option value="QUARTER_FINALS">Quarts de finale</option>
          <option value="SEMI_FINALS">Demi finale</option>
          <option value="FINAL">Finale</option>
        </select>
      </div>
      {!matchList && <Loader />}
      {matchList && (
        <div className={styles.pronosCards_container}>
          {/* Utilisation du filtre */}
          {filter
            ? filterMatchesByStage(matchList, filter).map((match: any) => {
                // Filtre les pronos pour ce match
                const matchPredictions = predictionsList?.filter(
                  (prediction: any) => prediction.matchId === match.id,
                );
                // Vérifie si l'utilisateur a fait un prono pour ce match
                const userPredictions = matchPredictions?.filter(
                  (prediction: any) => prediction.user.id === userId,
                );
                // Si l'utilisateur a fait un prono, affichage de tous les pronos pour ce match
                if (userPredictions && userPredictions.length > 0) {
                  return (
                    <div key={match.id}>
                      <MeteorCard
                        matchInfo={match}
                        matchPredictions={matchPredictions}
                      />
                    </div>
                  );
                }
                return null;
              })
            : matchList.map((match: any) => {
                // Filtre les pronos pour ce match
                const matchPredictions = predictionsList?.filter(
                  (prediction: any) => prediction.matchId === match.id,
                );
                // Vérifie si l'utilisateur a fait un prono pour ce match
                const userPredictions = matchPredictions?.filter(
                  (prediction: any) => prediction.user.id === userId,
                );
                // Si l'utilisateur a fait un prono, affichage de tous les pronos pour ce match
                if (userPredictions && userPredictions.length > 0) {
                  return (
                    <div key={match.id}>
                      <MeteorCard
                        matchInfo={match}
                        matchPredictions={matchPredictions}
                      />
                    </div>
                  );
                }
                return null;
              })}
        </div>
      )}
      <button onClick={() => setRefresh(true)} className={styles.refreshButton}>
        <RefreshRoundedIcon />
      </button>
    </div>
  );
}
