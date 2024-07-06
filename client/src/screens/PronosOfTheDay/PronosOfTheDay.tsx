import { MatchProps, PronosProps } from "../../interfaces/Interfaces";
import {
  useFetchMatchesFromApiQuery,
  useGetAllPredictionsQuery,
} from "../../gql/generated/schema";
import * as React from "react";
import { useEffect, useState } from "react";
import styles from "../Pronos/Pronos.module.css";
import { SparklesCore } from "../../components/ui/Sparkles";
import Loader from "../../components/Loader/Loader";
import { MeteorCard } from "../../components/ui/Meteor-card";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import { useNavigate } from "react-router-dom";
import {
  getCurrentDateString,
  handleCloseSnackbar,
} from "../../utils/functions";
import { Alert, Snackbar } from "@mui/material";
import { errorToast } from "../../utils/styles";
import { TypewriterEffectSmooth } from "../../components/ui/Typewritter-effect";
import { EyesLoader } from "../../components/EyesLoader/EyesLoader";

export function PronosOfTheDay({ refetchPronos, userId }: PronosProps) {
  const { data: allPredictions, refetch } = useGetAllPredictionsQuery();
  const { data: matches, refetch: refetchMatches } =
    useFetchMatchesFromApiQuery();
  const matchList = matches && matches.fetchMatchesFromAPI;

  const [refresh, setRefresh] = useState(false);

  const [currentDate, setCurrentDate] = useState(getCurrentDateString());

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(getCurrentDateString());
    }, 60000); // Mise à jour toutes les 60 secondes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRefresh(false);
    refetchMatches();
    refetch();
  }, [refresh, refetchPronos, refetch, refetchMatches]);

  const filterMatchesByDate = (matches: MatchProps[], date: string) => {
    return matches.filter(
      (match: MatchProps) => match.utcDate?.split("T")[0] === date,
    );
  };

  const predictionsList = allPredictions && allPredictions?.getAllPredictions;

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const handleCloseSnack = handleCloseSnackbar(setOpen);

  const refreshHandle = () => {
    setOpen(true);
    setRefresh(true);
  };

  return (
    <div
      className={styles.pronos_container}
      id={styles.pronosOfTheDay_container}
    >
      <div className={"back_button"}>
        <ButtonHoverGradient onClick={goBack}>Retour</ButtonHoverGradient>
      </div>
      <div
        style={{ background: "#020617" }}
        className="w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md"
      >
        <div className={styles.title_container}>
          <h1 className={styles.title}>Les Matchs</h1>
          <h1 className={styles.title_slim}>&nbsp;du jour</h1>
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
      {matchList && (
        <div className={styles.pronosCards_container}>
          {filterMatchesByDate(matchList, currentDate).map(
            (match: MatchProps) => {
              const matchPredictions = predictionsList?.filter(
                (prediction: any) => prediction.matchId === match.id,
              );
              const userPredictions = matchPredictions?.filter(
                (prediction: any) => prediction.user.id === userId,
              );
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
            },
          )}
          {filterMatchesByDate(matchList, currentDate).length < 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <TypewriterEffectSmooth
                words={[
                  { text: "Pas ", className: "text-[#94a3b8] text-xl" },
                  { text: "de ", className: "text-[#94a3b8] text-xl" },
                  { text: "matchs ", className: "text-[#94a3b8] text-xl" },
                  { text: "aujourd'hui.", className: "text-[#94a3b8] text-xl" },
                ]}
              />
              <EyesLoader />
            </div>
          )}
        </div>
      )}
      <button onClick={() => refreshHandle()} className={styles.refreshButton}>
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
