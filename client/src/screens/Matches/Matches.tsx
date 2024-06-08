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
import ThreeDCardDemo from "../../components/ui/3d-card-component";
import { points } from "../../utils/functions";
import LockIcon from "@mui/icons-material/Lock";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import Modal from "@mui/material/Modal";
import {
  matchesPredictionsMissedModalBox,
  modalStyle,
} from "../../utils/styles";
import Box from "@mui/material/Box";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ShimmerButton } from "../../components/ui/Shimmer-button/Shimmer-button";
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
  const [userMissedMatchesModal, setUserMissedMatchesModal] =
    React.useState(false);
  const handleUserMissedMatchesModal = () =>
    setUserMissedMatchesModal(!userMissedMatchesModal);

  // const matchList = matches && matches.fetchMatchesFromAPI;

  const matchList = data;

  const allUsersPrediction = allPredictions && allPredictions.getAllPredictions;

  const predictionList = userPredictions && userPredictions.getUserPredictions;

  const groupMatches = matchList && matchList.slice(0, 36);
  const roundOf16 = matchList && matchList.slice(36, 44);
  const quarterFinals = matchList && matchList.slice(44, 48);
  const semiFinals = matchList && matchList.slice(48, 50);
  const final = matchList && matchList.slice(50, 51);

  const updateComponent = () => {
    setRefresh(true);
    refreshPronos();
  };

  useEffect(() => {
    refetch();
    setRefresh(false);
  }, [refresh]);

  let myPointsArray: any = [];

  if (allUsersPrediction) {
    if (matchList) {
      myPointsArray = points(matchList, allUsersPrediction, userId);
    }
  }

  useEffect(() => {
    if (allUsersPrediction) {
      if (matchList) {
        myPointsArray = points(matchList, allUsersPrediction, userId); // Appeler points() lorsque userPredictions est mis à jour
      }
    }
  }, [allPredictions]);

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
        {myPointsArray.length > 0 && (
          <ThreeDCardDemo
            points={myPointsArray[myPointsArray.length - 1].totalUserPoints}
          />
        )}
        {!matchList && <Loader />}

        <div className={styles.links_container}>
          <a href="#groupMatches">
            <ButtonHoverGradient>Matchs de poule</ButtonHoverGradient>
          </a>
          <a href="#roundOf16">
            <ButtonHoverGradient>8ème de finale</ButtonHoverGradient>
          </a>
          <a href="#quarterFinals">
            <ButtonHoverGradient>Quarts de poule</ButtonHoverGradient>
          </a>
          <a href="#semiFinals">
            <ButtonHoverGradient>Demi de poule</ButtonHoverGradient>
          </a>
          <a href="#final">
            <ButtonHoverGradient>Finale</ButtonHoverGradient>
          </a>
        </div>
        <ShimmerButton
          className="left-1/2 transform -translate-x-1/2 mt-10"
          onClick={handleUserMissedMatchesModal}
        >
          Pronos à faire
        </ShimmerButton>
        {groupMatches && (
          <h2
            className={`${styles.round_title} ${styles.marginTop}`}
            id={"groupMatches"}
          >
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
                  className="rounded-[22px] p-4 sm:p-10 bg-gray-900"
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
                  homeTeamScoreRegularTime={groupMatch.score?.regularTime?.home}
                  awayTeamScoreRegularTime={groupMatch.score?.regularTime?.away}
                  homeTeamScoreExtraTime={groupMatch.score?.extraTime?.home}
                  awayTeamScoreExtraTime={groupMatch.score?.extraTime?.away}
                  userPrediction={matchUserPrediction}
                  updateComponent={updateComponent}
                  predictionIsActivated={groupPredictionsAreActivated}
                  points={matchPoints ? matchPoints.myPoints : undefined}
                />
              );
            })}
        </div>

        {roundOf16 && roundOf16 && (
          <h2
            className={`${styles.round_title} ${styles.border}`}
            id={"roundOf16"}
          >
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
                  className="rounded-[22px] p-4 sm:p-10 bg-zinc-900"
                  // style={{ width: "20vw" }}
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
          <h2
            className={`${styles.round_title} ${styles.border}`}
            id={"quarterFinals"}
          >
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
                  className="rounded-[22px] p-4 sm:p-10 bg-zinc-900"
                  // style={{ width: "20vw" }}
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
          <h2
            className={`${styles.round_title} ${styles.border}`}
            id={"semiFinals"}
          >
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
                  className="rounded-[22px] p-4 sm:p-10 bg-zinc-900"
                  // style={{ width: "20vw" }}
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
          <h2 className={`${styles.round_title} ${styles.border}`} id={"final"}>
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
                  className="rounded-[22px] p-4 sm:p-10 bg-zinc-900"
                  // style={{ width: "20vw" }}
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
      <Modal
        className={styles.myProfile_modal}
        sx={modalStyle}
        open={userMissedMatchesModal}
        onClose={handleUserMissedMatchesModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={matchesPredictionsMissedModalBox}
          className={styles.myProfile_modalBox}
        >
          <CloseRoundedIcon
            className={"closeIcon"}
            onClick={handleUserMissedMatchesModal}
          />
          {matchList && (
            <div className={styles.myProfile_predictionsMissed}>
              {matchList.map((match) => {
                // Filtre les pronos pour ce match
                const matchPredictions = predictionList?.filter(
                  (prediction: any) => prediction.matchId === match.id,
                );
                // Vérifie si l'utilisateur a fait un prono pour ce match
                const userPredictions = matchPredictions?.filter(
                  (prediction: any) => prediction.user.id === userId,
                );
                // Si l'utilisateur n'a pas fait de prono, on lui notifie
                if (!userPredictions || userPredictions?.length === 0) {
                  return (
                    <div key={match.id} className={styles.myProfile_matchInfo}>
                      <span>
                        {match.stage === "GROUP_STAGE"
                          ? "Match de poule"
                          : match.stage === "LAST_16"
                            ? "8ème de finale"
                            : match.stage === "QUARTER_FINALS"
                              ? "Quart de finale"
                              : match.stage === "SEMI_FINALS"
                                ? "Demi finale"
                                : "Finale"}
                      </span>

                      <div className={styles.myProfile_matchInfo_details}>
                        <span>{match.homeTeam?.name}</span>
                        <div className={styles.myProfile_matchInfo_flags}>
                          {match.homeTeam?.crest && match.homeTeam?.name && (
                            <img
                              src={match.homeTeam.crest}
                              alt={match.homeTeam.name}
                            />
                          )}
                          <span> - </span>
                          {match.awayTeam?.crest && match.awayTeam?.name && (
                            <img
                              src={match.awayTeam?.crest}
                              alt={match.awayTeam?.name}
                            />
                          )}
                        </div>
                        <span>{match.awayTeam?.name}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
