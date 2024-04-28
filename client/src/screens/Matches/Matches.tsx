import * as React from "react";
import { useEffect, useState } from "react";
import { MatchesProps } from "../../interfaces/Interfaces";
import styles from "./Matches.module.css";
import {
  useGetAllPredictionsQuery,
  useGetUserPredictionsQuery,
} from "../../gql/generated/schema";
import { GradientCard } from "../../components/ui/Gradient-card";
import { SparklesCore } from "../../components/ui/Sparkles";
import { TracingBeam } from "../../components/ui/Tracing-beam";
import Loader from "../../components/Loader/Loader";
import { AnimatedTooltip } from "../../components/ui/Animated-tooltip";
import LockIcon from "@mui/icons-material/Lock";
import data from "../../matches.json";

export default function Matches({
  userId,
  groupPredictionsAreActivated,
  roundOf16PredictionsAreActivated,
  quarterPredictionsAreActivated,
  semiFinalsPredictionsAreActivated,
  finalPredictionsAreActivated,
  refreshPronos,
}: MatchesProps) {
  // const { data: matches } = useFetchMatchesFromApiQuery();

  const { data: userPredictions, refetch } = useGetUserPredictionsQuery({
    variables: { userId: userId },
  });

  const { data: allPredictions } = useGetAllPredictionsQuery();

  const [refresh, setRefresh] = useState(false);

  // const matchList = matches && matches.fetchMatchesFromAPI;

  const matchList = data;

  const predictionList = userPredictions && userPredictions.getUserPredictions;

  const groupMatches = matchList && matchList.slice(0, 36);
  const roundOf16 = matchList && matchList.slice(36, 44);
  const quarterFinals = matchList && matchList.slice(44, 48);
  const semiFinals = matchList && matchList.slice(48, 50);
  const final = matchList && matchList.slice(50, 51);

  // console.log(predictionList);
  // console.log(XXX);

  const updateComponent = () => {
    setRefresh(true);
    refreshPronos();
  };

  useEffect(() => {
    refetch();
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    points(); // Appeler points() lorsque userPredictions est mis à jour
  }, [allPredictions]);

  const points = () => {
    return matchList.map((match: any) => {
      const userPredictions = allPredictions?.getAllPredictions.filter(
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
          const uniquePrediction = allPredictions?.getAllPredictions.filter(
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

        return { matchId: match.id, myPoints: myPoints };
      }

      // Si aucune prédiction n'est trouvée pour ce match, retourner un objet undefined
      // pour ne pas afficher de points
      return { matchId: match.id, myPoints: undefined };
    });
  };

  const myPointsArray = points();

  return (
    <div className={styles.macthes}>
      <TracingBeam className="px-6">
        <div
          style={{ background: "#020617" }}
          className="w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md"
        >
          <div className={styles.title_container}>
            <h1 className={styles.title}>Mes</h1>
            <h1 className={styles.title_slim}>&nbsp;Pronos</h1>
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
        {!matchList && <Loader />}
        {groupMatches && (
          <h2 className={styles.round_title}>
            <span className={styles.subtitle_slim}>Matchs</span>
            <span className={styles.subtitle}>&nbsp;de poules</span>
            {!groupPredictionsAreActivated && (
              <span className={styles.canDoPrediction}>
                <AnimatedTooltip items={"Impossible de saisir les pronos"}>
                  <LockIcon />
                </AnimatedTooltip>
              </span>
            )}
          </h2>
        )}

        <div className={styles.groupMatches}>
          {groupMatches &&
            groupMatches.map((groupMatch: any) => {
              const matchUserPrediction = predictionList?.find(
                (prediction: any) => prediction.matchId === groupMatch.id,
              );

              const matchPoints = myPointsArray.find(
                (match: any) => match.matchId === groupMatch.id,
              );

              return (
                <GradientCard
                  className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-gray-900"
                  style={{ width: "20vw" }}
                  key={groupMatch.id}
                  userId={userId}
                  matchId={groupMatch.id}
                  matchGroup={groupMatch.group}
                  matchUtcDate={groupMatch.utcDate}
                  matchStatus={groupMatch.status}
                  homeTeamCrest={groupMatch.homeTeam?.crest}
                  homeTeamName={groupMatch.homeTeam?.name}
                  awayTeamCrest={groupMatch.awayTeam?.crest}
                  awayTeamName={groupMatch.awayTeam?.name}
                  homeTeamScore={groupMatch.score?.fullTime?.home}
                  awayTeamScore={groupMatch.score?.fullTime?.away}
                  userPrediction={matchUserPrediction}
                  updateComponent={updateComponent}
                  predictionIsActivated={groupPredictionsAreActivated}
                  points={matchPoints ? matchPoints.myPoints : undefined}
                />
              );
            })}
        </div>

        {roundOf16 && roundOf16 && (
          <h2 className={`${styles.round_title} ${styles.border}`}>
            <span className={styles.subtitle}>8èmes</span>
            <span className={styles.subtitle_slim}>&nbsp;de finale</span>
            {!roundOf16PredictionsAreActivated && (
              <span className={styles.canDoPrediction}>
                <AnimatedTooltip items={"Impossible de saisir les pronos"}>
                  <LockIcon />
                </AnimatedTooltip>
              </span>
            )}
          </h2>
        )}

        <div className={styles.groupMatches}>
          {roundOf16 &&
            roundOf16.map((roundOf16Match: any) => {
              const matchUserPrediction = predictionList?.find(
                (prediction: any) => prediction.matchId === roundOf16Match.id,
              );
              return (
                <GradientCard
                  className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900"
                  style={{ width: "20vw" }}
                  key={roundOf16Match.id}
                  userId={userId}
                  matchId={roundOf16Match.id}
                  matchGroup={roundOf16Match.group}
                  matchUtcDate={roundOf16Match.utcDate}
                  matchStatus={roundOf16Match.status}
                  homeTeamCrest={roundOf16Match.homeTeam?.crest}
                  homeTeamName={roundOf16Match.homeTeam?.name}
                  awayTeamCrest={roundOf16Match.awayTeam?.crest}
                  awayTeamName={roundOf16Match.awayTeam?.name}
                  homeTeamScore={roundOf16Match.score?.fullTime?.home}
                  awayTeamScore={roundOf16Match.score?.fullTime?.away}
                  userPrediction={matchUserPrediction}
                  updateComponent={updateComponent}
                  predictionIsActivated={roundOf16PredictionsAreActivated}
                />
              );
            })}
        </div>

        {quarterFinals && quarterFinals && (
          <h2 className={`${styles.round_title} ${styles.border}`}>
            <span className={styles.subtitle}>Quarts</span>
            <span className={styles.subtitle_slim}>&nbsp;de finale</span>
            {!quarterPredictionsAreActivated && (
              <span className={styles.canDoPrediction}>
                <AnimatedTooltip items={"Impossible de saisir les pronos"}>
                  <LockIcon />
                </AnimatedTooltip>
              </span>
            )}
          </h2>
        )}

        <div className={styles.groupMatches}>
          {quarterFinals &&
            quarterFinals.map((quarterFinalsMatch: any) => {
              const matchUserPrediction = predictionList?.find(
                (prediction: any) =>
                  prediction.matchId === quarterFinalsMatch.id,
              );
              return (
                <GradientCard
                  className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900"
                  style={{ width: "20vw" }}
                  key={quarterFinalsMatch.id}
                  userId={userId}
                  matchId={quarterFinalsMatch.id}
                  matchGroup={quarterFinalsMatch.group}
                  matchUtcDate={quarterFinalsMatch.utcDate}
                  matchStatus={quarterFinalsMatch.status}
                  homeTeamCrest={quarterFinalsMatch.homeTeam?.crest}
                  homeTeamName={quarterFinalsMatch.homeTeam?.name}
                  awayTeamCrest={quarterFinalsMatch.awayTeam?.crest}
                  awayTeamName={quarterFinalsMatch.awayTeam?.name}
                  homeTeamScore={quarterFinalsMatch.score?.fullTime?.home}
                  awayTeamScore={quarterFinalsMatch.score?.fullTime?.away}
                  userPrediction={matchUserPrediction}
                  updateComponent={updateComponent}
                  predictionIsActivated={quarterPredictionsAreActivated}
                />
              );
            })}
        </div>

        {semiFinals && semiFinals && (
          <h2 className={`${styles.round_title} ${styles.border}`}>
            <span className={styles.subtitle}>Demi</span>
            <span className={styles.subtitle_slim}>&nbsp;finales</span>
            {!semiFinalsPredictionsAreActivated && (
              <span className={styles.canDoPrediction}>
                <AnimatedTooltip items={"Impossible de saisir les pronos"}>
                  <LockIcon />
                </AnimatedTooltip>
              </span>
            )}
          </h2>
        )}

        <div className={styles.groupMatches}>
          {semiFinals &&
            semiFinals.map((semiFinalsMatch: any) => {
              const matchUserPrediction = predictionList?.find(
                (prediction: any) => prediction.matchId === semiFinalsMatch.id,
              );
              return (
                <GradientCard
                  className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900"
                  style={{ width: "20vw" }}
                  key={semiFinalsMatch.id}
                  userId={userId}
                  matchId={semiFinalsMatch.id}
                  matchGroup={semiFinalsMatch.group}
                  matchUtcDate={semiFinalsMatch.utcDate}
                  matchStatus={semiFinalsMatch.status}
                  homeTeamCrest={semiFinalsMatch.homeTeam?.crest}
                  homeTeamName={semiFinalsMatch.homeTeam?.name}
                  awayTeamCrest={semiFinalsMatch.awayTeam?.crest}
                  awayTeamName={semiFinalsMatch.awayTeam?.name}
                  homeTeamScore={semiFinalsMatch.score?.fullTime?.home}
                  awayTeamScore={semiFinalsMatch.score?.fullTime?.away}
                  userPrediction={matchUserPrediction}
                  updateComponent={updateComponent}
                  predictionIsActivated={semiFinalsPredictionsAreActivated}
                />
              );
            })}
        </div>

        {final && final && (
          <h2 className={`${styles.round_title} ${styles.border}`}>
            <span className={styles.subtitle}>Finale</span>
            {!finalPredictionsAreActivated && (
              <span className={styles.canDoPrediction}>
                <AnimatedTooltip items={"Impossible de saisir les pronos"}>
                  <LockIcon />
                </AnimatedTooltip>
              </span>
            )}
          </h2>
        )}

        <div className={styles.groupMatches}>
          {final &&
            final.map((finalMatch: any) => {
              const matchUserPrediction = predictionList?.find(
                (prediction: any) => prediction.matchId === finalMatch.id,
              );
              return (
                <GradientCard
                  className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900"
                  style={{ width: "20vw" }}
                  key={finalMatch.id}
                  userId={userId}
                  matchId={finalMatch.id}
                  matchGroup={finalMatch.group}
                  matchUtcDate={finalMatch.utcDate}
                  matchStatus={finalMatch.status}
                  homeTeamCrest={finalMatch.homeTeam?.crest}
                  homeTeamName={finalMatch.homeTeam?.name}
                  awayTeamCrest={finalMatch.awayTeam?.crest}
                  awayTeamName={finalMatch.awayTeam?.name}
                  homeTeamScore={finalMatch.score?.fullTime?.home}
                  awayTeamScore={finalMatch.score?.fullTime?.away}
                  userPrediction={matchUserPrediction}
                  updateComponent={updateComponent}
                  predictionIsActivated={finalPredictionsAreActivated}
                />
              );
            })}
        </div>
      </TracingBeam>
    </div>
  );
}
