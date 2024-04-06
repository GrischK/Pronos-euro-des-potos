import styles from "./MatchCard.module.css";
import {useEffect, useState} from "react";
import {useCreatePredictionMutation} from "../../gql/generated/schema";
import GradientButton from "../GradientButton/GradientButton";

interface PredictionInterface {
    matchId: number,
    user: number,
    homeTeamScorePrediction: number,
    awayTeamScorePrediction: number
}


interface CardProps {
    userId: number,
    matchId: number,
    matchGroup: string | undefined | null,
    matchUtcDate: string | undefined | null,
    matchStatus: string | undefined | null,
    homeTeamCrest: string | undefined | null,
    homeTeamName: string | undefined | null,
    awayTeamCrest: string | undefined | null,
    awayTeamName: string | undefined | null,
    homeTeamScore: number | undefined | null,
    awayTeamScore: number | undefined | null,
    userPrediction: any | undefined | null,
    updateComponent: () => void
}

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
                                      updateComponent
                                  }: CardProps) {
    const [newPrediction, setNewPrediction] = useState<PredictionInterface>({
        matchId: matchId,
        user: userId,
        homeTeamScorePrediction: 0,
        awayTeamScorePrediction: 0,
    });
    const [createPrediction] = useCreatePredictionMutation()

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
        updateComponent()
    }

    function formatDate(dateString: string) {
        const options: Intl.DateTimeFormatOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
    }

    function formatString(groupName: string) {
        return groupName.replace("_", ' ')
    }

    console.log(userPrediction)

    return (
        <div
            key={matchId}
            className={styles.match_card}
        >
            {matchGroup && (
                <span>{formatString(matchGroup)}</span>
            )}
            {matchUtcDate && (
                <span>{formatDate(matchUtcDate)}</span>
            )}
            {matchStatus !== 'FINISHED' ? 'A venir' : 'Terminé'}
            <div className={styles.card_teams}>
                <div className={styles.container}>
                    <div className={styles.team_details}>
                        {
                            homeTeamCrest && homeTeamName ?
                                <img src={homeTeamCrest} alt={homeTeamName}/>
                                :
                                null
                        }
                        <span className={styles.team_name}>{homeTeamName}</span>
                        <span className={styles.team_score}>{homeTeamScore}</span>
                    </div>
                    <div className={styles.team_details}>
                        {
                            awayTeamCrest && awayTeamName ?
                                <img src={awayTeamCrest} alt={awayTeamName}/>
                                :
                                null
                        }
                        <span className={styles.team_name}>{awayTeamName}</span>
                        <span className={styles.team_score}>{awayTeamScore}</span>
                    </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.input_container}>
                        <label htmlFor="home-team">{homeTeamName}</label>
                        <input className={styles.prediction_input} type="text"
                               value={userPrediction?.homeTeamScorePrediction | newPrediction.homeTeamScorePrediction}
                               onChange={(e) =>
                                   setNewPrediction((prevState) => ({
                                       ...prevState,
                                       homeTeamScorePrediction: Number(e.target.value),
                                   }))
                               }
                               disabled={userPrediction?.homeTeamScorePrediction !== undefined}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label htmlFor="home-team">{awayTeamName}</label>
                        <input className={styles.prediction_input} type="text"
                               value={userPrediction?.awayTeamScorePrediction | newPrediction.awayTeamScorePrediction}
                               onChange={(e) =>
                                   setNewPrediction((prevState) => ({
                                       ...prevState,
                                       awayTeamScorePrediction: Number(e.target.value),
                                   }))
                               }
                               disabled={userPrediction?.awayTeamScorePrediction !== undefined}
                        />
                    </div>
                </div>
                {!userPrediction?.awayTeamScorePrediction === undefined && !userPrediction?.homeTeamScorePrediction === undefined
                    ?
                    <GradientButton onClick={onClickCreateNewGame}>OK</GradientButton>
                    :
                    null
                }
            </div>
        </div>
    )
}