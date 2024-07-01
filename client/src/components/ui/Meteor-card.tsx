import React from "react";
import { Meteors } from "./Meteor-card/Meteor-card";
import styles from "./Meteor-card/Meteor-card.module.css";
import {
  formatDate,
  formatGroupName,
  formatStageName,
  formatTime,
  getTranslatedName,
  pointsForOneMatch,
} from "../../utils/functions";
import { AlarmOnRounded } from "@mui/icons-material";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";

interface MeteorCardProps {
  matchInfo: any;
  matchPredictions: any;
}

export function MeteorCard({ matchInfo, matchPredictions }: MeteorCardProps) {
  const x = matchPredictions.map((pred: any) => {
    const y = pointsForOneMatch(matchInfo, matchPredictions, pred.user.id);
    return y;
  });

  return (
    <div className="">
      <div className=" w-full relative max-w-xs">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <span className="w-full text-center text-white pb-2">
            {matchInfo.group
              ? formatGroupName(matchInfo.group)
              : formatStageName(matchInfo.stage)}
          </span>
          <div className={styles.matchStatusContainer}>
            {matchInfo.status === "FINISHED" ? (
              <span className={styles.matchStatus_finished}>Terminé</span>
            ) : matchInfo.status === "IN_PLAY" ||
              matchInfo.status === "PAUSED" ? (
              <span className={styles.matchStatus_inPlay}>En cours</span>
            ) : (
              <span className={styles.matchStatus_comingSoon}>À venir</span>
            )}
          </div>
          <div className={styles.teams_flags}>
            <img src={matchInfo.homeTeam.crest} alt={matchInfo.homeTeam.name} />
            <img src={matchInfo.awayTeam.crest} alt={matchInfo.homeTeam.name} />
          </div>
          {matchInfo.status && (
            <div className={styles.match_finalScore}>
              <span className={styles.match_date}>
                {formatDate(matchInfo.utcDate)}
              </span>
              <span className={styles.matchTime}>
                {formatTime(matchInfo.utcDate).replace(":", "h")}
              </span>
            </div>
          )}
          {matchInfo.status !== "TIMED" && (
            <div className={styles.match_score}>
              {matchInfo.score.extraTime && (
                <div className={styles.match_chrono}>
                  90'
                  <AlarmOnRounded />
                </div>
              )}
              <span>
                {matchInfo.score?.regularTime?.home.toString()
                  ? matchInfo.score?.regularTime?.home?.toString()
                  : matchInfo.score?.fullTime?.home}
              </span>
              &nbsp; - &nbsp;
              <span>
                {matchInfo.score?.regularTime?.away.toString()
                  ? matchInfo.score?.regularTime?.away?.toString()
                  : matchInfo.score?.fullTime?.away}
              </span>
            </div>
          )}

          {matchInfo.score.extraTime && (
            <div className={styles.match_extraTime}>
              <span>Prolongation</span>
              <div className={styles.match_score}>
                <span>
                  {(
                    matchInfo.score?.extraTime?.home +
                    matchInfo.score?.regularTime?.home
                  ).toString()}
                </span>
                &nbsp; - &nbsp;
                <span>
                  {(
                    matchInfo.score?.extraTime?.away +
                    matchInfo.score?.regularTime?.away
                  ).toString()}
                </span>
              </div>
            </div>
          )}

          {matchInfo.score.penalties && (
            <div className={styles.match_extraTime}>
              <div className={styles.match_chrono}>
                Tirs au but &nbsp; <SportsSoccerRoundedIcon />
              </div>
              <div className={styles.match_score}>
                <span>
                  {matchInfo.score?.extraTime?.penalties.home.toString()}
                </span>
                &nbsp; - &nbsp;
                <span>
                  {matchInfo.score?.extraTime?.penalties.away.toString()}
                </span>
              </div>
            </div>
          )}

          <h1 className="font-bold text-xl text-white mb-4 relative z-50 flex justify-center w-full">
            {getTranslatedName(matchInfo.homeTeam.name)}
            <span>&nbsp;-&nbsp;</span>
            {getTranslatedName(matchInfo.awayTeam.name)}
          </h1>

          <div className="font-normal text-base text-slate-500 mb-4 relative z-50">
            <span className={styles.match_pronos}>Pronos des potos</span>
            {matchPredictions.map((prediction: any) => {
              // Filtre les résultats pour le prono du joueur
              const userResult = x.find(
                (result: any) => result.userId === prediction.user.id,
              );

              // Récupère les points du joueur pour ce match
              const userPoints: number = userResult ? userResult.myPoints : 0;

              return (
                <div key={prediction.id} className={styles.user_prono}>
                  <span>{prediction.user.userName}</span>
                  <span>
                    {prediction.homeTeamScorePrediction}-
                    {prediction.awayTeamScorePrediction}
                  </span>
                  {matchInfo.status === "FINISHED" &&
                    (userPoints === 1 ? (
                      <span className={styles.winOnePoint}>
                        +{userPoints} pt
                      </span>
                    ) : userPoints === 3 ? (
                      <span className={styles.winThreePoints}>
                        +{userPoints} pts
                      </span>
                    ) : userPoints === 4 ? (
                      <span className={styles.winFourPoints}>
                        +{userPoints} pts
                      </span>
                    ) : (
                      <span className={styles.winNoPoint}>0 pt</span>
                    ))}
                </div>
              );
            })}
          </div>
          {/* Meaty part - Meteor effect */}
          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
