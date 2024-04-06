import styles from "./MatchCard.module.css";
import {useState} from "react";
import {useCreatePredictionMutation} from "../../gql/generated/schema";

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
    awayTeamScore: number | undefined | null
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
                                  }: CardProps) {
    const [newPrediction, setNewPrediction] = useState<PredictionInterface>({
        matchId: matchId,
        user: userId,
        homeTeamScorePrediction: 0,
        awayTeamScorePrediction: 0
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
    }

    function formatDate(dateString: string) {
        const options: Intl.DateTimeFormatOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
    }

    function formatString(groupName: string) {
        return groupName.replace("_", ' ')
    }


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
                <div>
                    <label htmlFor="home-team">{homeTeamName}</label>
                    <input type="text"
                           value={newPrediction.homeTeamScorePrediction}
                           onChange={(e) =>
                               setNewPrediction((prevState) => ({
                                   ...prevState,
                                   homeTeamScorePrediction: Number(e.target.value),
                               }))
                           }
                    />
                    <label htmlFor="home-team">{awayTeamName}</label>
                    <input type="text"
                           value={newPrediction.awayTeamScorePrediction}
                           onChange={(e) =>
                               setNewPrediction((prevState) => ({
                                   ...prevState,
                                   awayTeamScorePrediction: Number(e.target.value),
                               }))
                           }
                    />
                    <button onClick={onClickCreateNewGame}>Valider prono</button>
                </div>
            </div>
        </div>
    )
}