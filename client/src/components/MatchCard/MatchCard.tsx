import styles from "./MatchCard.module.css";
import { CardProps, PredictionInterface } from "../../interfaces/Interfaces";
import React, { useState } from "react";
import {
  useCreatePredictionMutation,
  useUpdatePredictionMutation,
} from "../../gql/generated/schema";
import GradientButton from "../GradientButton/GradientButton";
import { formatDate } from "../../utils/functions";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MatchCard({
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
  userPrediction,
  updateComponent,
  predictionIsActivated,
}: CardProps) {
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
    });
    updateComponent();
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

  function formatString(groupName: string) {
    return groupName.replace("_", " ");
  }

  return (
    <div key={matchId} className={styles.match_card}>
      {matchGroup && <span>{formatString(matchGroup)}</span>}
      {matchUtcDate && <span>{formatDate(matchUtcDate)}</span>}
      {matchStatus !== "FINISHED" ? "A venir" : "Terminé"}
      <div className={styles.card_teams}>
        <div className={styles.container}>
          <div className={styles.team_details}>
            {homeTeamCrest && homeTeamName ? (
              <img src={homeTeamCrest} alt={homeTeamName} />
            ) : null}
            <span className={styles.team_name}>{homeTeamName}</span>
            <span className={styles.team_score}>{homeTeamScore}</span>
          </div>
          <div className={styles.team_details}>
            {awayTeamCrest && awayTeamName ? (
              <img src={awayTeamCrest} alt={awayTeamName} />
            ) : null}
            <span className={styles.team_name}>{awayTeamName}</span>
            <span className={styles.team_score}>{awayTeamScore}</span>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.input_container}>
            <label htmlFor="home-team">{homeTeamName}</label>
            <input
              className={styles.prediction_input}
              type="text"
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
          <div className={styles.input_container}>
            <label htmlFor="home-team">{awayTeamName}</label>
            <input
              className={styles.prediction_input}
              type="text"
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
        </div>
        {userPrediction?.awayTeamScorePrediction === undefined &&
        userPrediction?.homeTeamScorePrediction === undefined &&
        predictionIsActivated ? (
          <GradientButton onClick={onClickCreateNewGame}>OK</GradientButton>
        ) : null}
        {userPrediction?.awayTeamScorePrediction !== undefined &&
        userPrediction?.homeTeamScorePrediction !== undefined &&
        predictionIsActivated ? (
          <div className={styles.icon_container}>
            <EditIcon
              className={styles.modify_prediction}
              onClick={handleOpen}
            />
          </div>
        ) : null}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Modifier mon prono
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <div className={styles.container}>
                <div className={styles.input_container}>
                  <label htmlFor="home-team">{homeTeamName}</label>
                  <input
                    className={styles.prediction_input}
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
                <div className={styles.input_container}>
                  <label htmlFor="home-team">{awayTeamName}</label>
                  <input
                    className={styles.prediction_input}
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
                <GradientButton onClick={onClickUpdateGame}>OK</GradientButton>
              </div>
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
