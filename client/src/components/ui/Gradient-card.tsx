import { cn } from "../../utils/cn";
import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "../MatchCard/MatchCard.module.css";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PredictionInterface } from "../../interfaces/Interfaces";
import {
  useCreatePredictionMutation,
  useUpdatePredictionMutation,
} from "../../gql/generated/schema";
import { GradientInput } from "./Gradient-input";
import { boxStyle, modalStyle, updatePronoContainer } from "../../utils/styles";
import { AnimatedTooltip } from "./Animated-tooltip";
import CheckRoundedCircleIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  formatDate,
  formatGroupName,
  formatTime,
  getTranslatedName,
} from "../../utils/functions";
import AddAlarmRoundedIcon from "@mui/icons-material/AddAlarmRounded";

export const GradientCard = ({
  className,
  containerClassName,
  animate = true,
  style,
  userId,
  matchId,
  matchGroup,
  matchUtcDate,
  matchStatus,
  homeTeamCrest,
  homeTeamName,
  awayTeamCrest,
  awayTeamName,
  homeTeamScore,
  awayTeamScore,
  homeTeamScoreExtraTime,
  awayTeamScoreExtraTime,
  homeTeamScoreRegularTime,
  awayTeamScoreRegularTime,
  homeTeamPenalties,
  awayTeamPenalties,
  userPrediction,
  updateComponent,
  predictionIsActivated,
  points,
  openErrorSnack,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  style?: {};
  userId: number;
  matchId: number;
  matchGroup: string | undefined | null;
  matchUtcDate: string | undefined | null;
  matchStatus: string | undefined | null;
  homeTeamCrest: string | undefined | null;
  homeTeamName: string;
  awayTeamCrest: string | undefined | null;
  awayTeamName: string;
  homeTeamScore: number | undefined | null;
  awayTeamScore: number | undefined | null;
  homeTeamScoreExtraTime?: number | undefined | null;
  awayTeamScoreExtraTime?: number | undefined | null;
  homeTeamScoreRegularTime?: number | undefined | null;
  awayTeamScoreRegularTime?: number | undefined | null;
  homeTeamPenalties?: number | undefined | null;
  awayTeamPenalties?: number | undefined | null;
  userPrediction: any | undefined | null;
  updateComponent: () => void;
  predictionIsActivated: boolean | undefined;
  points?: number | undefined;
  openErrorSnack: () => void;
}) => {
  const [newPrediction, setNewPrediction] = useState<PredictionInterface>({
    matchId: matchId,
    user: userId,
    homeTeamScorePrediction: 0,
    awayTeamScorePrediction: 0,
  });

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [createPrediction] = useCreatePredictionMutation();
  const [updatePrediction] = useUpdatePredictionMutation();

  const onClickCreateNewGame = async () => {
    await createPrediction({
      variables: {
        data: {
          matchId: newPrediction.matchId,
          user: newPrediction.user,
          homeTeamScorePrediction: newPrediction.homeTeamScorePrediction,
          awayTeamScorePrediction: newPrediction.awayTeamScorePrediction,
        },
      },
    })
      .then(() => {
        updateComponent();
      })
      .catch(() => {
        openErrorSnack();
      });
  };

  const onClickUpdateGame = async () => {
    await updatePrediction({
      variables: {
        updatePredictionId: userPrediction.id,
        data: {
          homeTeamScorePrediction: newPrediction.homeTeamScorePrediction,
          awayTeamScorePrediction: newPrediction.awayTeamScorePrediction,
        },
      },
    });
    updateComponent();
    handleClose();
  };

  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div
      className={cn(
        "relative p-[4px] group cursor-pointer text-white sm:w-[70%] md:w-[20vw]",
        containerClassName,
      )}
      style={style}
    >
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]",
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]",
        )}
      />

      <div className={cn("relative z-10 h-full", className)}>
        <div key={matchId} className={styles.gradient_card}>
          {matchGroup && <span>{formatGroupName(matchGroup)}</span>}
          {matchUtcDate && <span>{formatDate(matchUtcDate)}</span>}
          {matchUtcDate && (
            <span className={styles.matchTime}>
              {formatTime(matchUtcDate).replace(":", "h")}
            </span>
          )}
          {matchStatus === "FINISHED" ? (
            <span className={styles.matchStatus_finished}>Terminé</span>
          ) : matchStatus === "IN_PLAY" || matchStatus === "PAUSED" ? (
            <span className={styles.matchStatus_inPlay}>En cours</span>
          ) : (
            <span className={styles.matchStatus_comingSoon}>À venir</span>
          )}
          {points !== undefined &&
            points === 1 &&
            matchStatus === "FINISHED" && (
              <span className={styles.winOnePoint}>+{points} point</span>
            )}
          {points !== undefined &&
            points === 3 &&
            matchStatus === "FINISHED" && (
              <span className={styles.winThreePoints}>+{points} points</span>
            )}
          {points !== undefined &&
            points === 4 &&
            matchStatus === "FINISHED" && (
              <span className={styles.winFourPoints}>+{points} points</span>
            )}
          {points !== undefined && points < 1 && matchStatus === "FINISHED" && (
            <span className={styles.winNoPoint}>0 point</span>
          )}
          <div className={styles.card_teams}>
            <div className={styles.container}>
              <div className={styles.team_details}>
                {homeTeamCrest && homeTeamName ? (
                  <img src={homeTeamCrest} alt={homeTeamName} />
                ) : null}
                <span className={styles.team_name}>
                  {getTranslatedName(homeTeamName)}
                </span>
                <span className={styles.team_score}>
                  {homeTeamScoreRegularTime
                    ? homeTeamScoreRegularTime?.toString()
                    : homeTeamScore}
                </span>
              </div>
              <div className={styles.team_details}>
                {awayTeamCrest && awayTeamName ? (
                  <img src={awayTeamCrest} alt={awayTeamName} />
                ) : null}
                <span className={styles.team_name}>
                  {getTranslatedName(awayTeamName)}
                </span>
                <span className={styles.team_score}>
                  {awayTeamScoreRegularTime?.toString()
                    ? awayTeamScoreRegularTime
                    : awayTeamScore}
                </span>
              </div>
            </div>
            {homeTeamScoreExtraTime?.toString() !== undefined &&
              homeTeamScoreExtraTime !== null &&
              awayTeamScoreExtraTime?.toString() !== undefined &&
              awayTeamScoreExtraTime !== null &&
              homeTeamScoreRegularTime?.toString() &&
              awayTeamScoreRegularTime?.toString() && (
                <div className={styles.extraTime_container}>
                  <span className={styles.extraTime}>
                    Prolongation &nbsp;
                    <AddAlarmRoundedIcon />
                  </span>
                  <div className={styles.container}>
                    <span className={styles.team_score}>
                      {homeTeamScoreRegularTime + homeTeamScoreExtraTime}
                    </span>
                    -
                    <span className={styles.team_score}>
                      {awayTeamScoreRegularTime + awayTeamScoreExtraTime}
                    </span>
                  </div>
                </div>
              )}
            {homeTeamPenalties?.toString() !== undefined &&
              homeTeamPenalties !== null &&
              awayTeamPenalties?.toString() !== undefined &&
              awayTeamPenalties !== null && (
                <>
                  <span>Tirs au but</span>

                  <div className={styles.container}>
                    <span className={styles.team_score}>
                      {homeTeamPenalties}
                    </span>
                    -
                    <span className={styles.team_score}>
                      {awayTeamPenalties}
                    </span>
                  </div>
                </>
              )}
            <span className={styles.match_prono}>Mon prono</span>
            <div className={styles.container}>
              {!userPrediction && !predictionIsActivated ? (
                <span className={styles.no_prono}>Aucun prono inscrit</span>
              ) : (
                <>
                  <div className={styles.input_wrapper}>
                    <GradientInput
                      className={"font-bold text-2xl"}
                      type="text"
                      inputMode={"numeric"}
                      value={
                        userPrediction?.homeTeamScorePrediction |
                        newPrediction.homeTeamScorePrediction
                      }
                      onChange={(e) =>
                        setNewPrediction((prevState) => ({
                          ...prevState,
                          homeTeamScorePrediction: Number(e.target.value),
                        }))
                      }
                      disabled={
                        userPrediction?.homeTeamScorePrediction !== undefined ||
                        !predictionIsActivated
                      }
                    />
                  </div>
                  <div className={styles.input_wrapper}>
                    <GradientInput
                      className={"font-bold text-2xl"}
                      type="text"
                      inputMode={"numeric"}
                      value={
                        userPrediction?.awayTeamScorePrediction |
                        newPrediction.awayTeamScorePrediction
                      }
                      onChange={(e) =>
                        setNewPrediction((prevState) => ({
                          ...prevState,
                          awayTeamScorePrediction: Number(e.target.value),
                        }))
                      }
                      disabled={
                        userPrediction?.awayTeamScorePrediction !== undefined ||
                        !predictionIsActivated
                      }
                    />
                  </div>
                </>
              )}
            </div>
            {userPrediction?.awayTeamScorePrediction === undefined &&
            userPrediction?.homeTeamScorePrediction === undefined &&
            predictionIsActivated ? (
              <button
                className="p-[3px] relative"
                onClick={onClickCreateNewGame}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                  OK
                </div>
              </button>
            ) : null}
            {userPrediction?.awayTeamScorePrediction !== undefined &&
            userPrediction?.homeTeamScorePrediction !== undefined &&
            predictionIsActivated ? (
              <div className={styles.icon_container}>
                <AnimatedTooltip items={"Modifier mon prono"}>
                  <EditIcon
                    color={"primary"}
                    className={styles.modify_prediction}
                    onClick={handleOpen}
                  />
                </AnimatedTooltip>
              </div>
            ) : null}
            <Modal
              className={styles.changePronos_modal}
              sx={modalStyle}
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={boxStyle} className={styles.changePronos_modalBox}>
                <CloseRoundedIcon
                  className={"closeIcon"}
                  onClick={handleClose}
                />
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Modifier mon prono
                </Typography>
                <Typography
                  id="modal-modal-description"
                  sx={updatePronoContainer}
                >
                  <div className={styles.container}>
                    <div
                      className={`${styles.input_container} ${styles.updateScore_input_container}`}
                    >
                      <label htmlFor="home-team">{homeTeamName}</label>
                      <GradientInput
                        className={"font-bold text-2xl"}
                        type="text"
                        value={newPrediction.homeTeamScorePrediction}
                        onChange={(e) =>
                          setNewPrediction((prevState) => ({
                            ...prevState,
                            homeTeamScorePrediction: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div
                      className={`${styles.input_container} ${styles.updateScore_input_container}`}
                    >
                      <label htmlFor="home-team">{awayTeamName}</label>
                      <GradientInput
                        className={"font-bold text-2xl"}
                        type="text"
                        value={newPrediction.awayTeamScorePrediction}
                        onChange={(e) =>
                          setNewPrediction((prevState) => ({
                            ...prevState,
                            awayTeamScorePrediction: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className={"spacing"}>
                    <CheckRoundedCircleIcon
                      fontSize={"large"}
                      color={"primary"}
                      onClick={onClickUpdateGame}
                    />
                    <CancelRoundedIcon
                      fontSize={"large"}
                      color={"error"}
                      onClick={handleClose}
                    />
                  </div>
                </Typography>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};
