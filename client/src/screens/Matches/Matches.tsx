import styles from "./Matches.module.css"
import {useFetchMatchesFromApiQuery, useGetUserPredictionsQuery} from "../../gql/generated/schema";
import MatchCard from "../../components/MatchCard/MatchCard";
import {useEffect, useState} from "react";

export interface MatchesProps {
    userId: number,
}

export default function Matches({userId}: MatchesProps) {
    const {data: matches} = useFetchMatchesFromApiQuery()
    const {data: userPredictions, refetch} = useGetUserPredictionsQuery({variables: {userId: userId}})
    const [refresh, setRefresh] = useState(false);

    const matchList = matches && matches.fetchMatchesFromAPI;
    console.log(matchList)

    const predictionList = userPredictions && userPredictions.getUserPredictions
    console.log(predictionList)

    const updateComponent = () => {
        setRefresh(true);
    };

    useEffect(()=>{
        refetch()
        setRefresh(false)
    },[refresh])

    return (
        <div className={styles.macthes}>
            {matchList && matchList.map((match) => {
                // Filtrer les prédictions de l'utilisateur pour le match actuel
                const matchUserPrediction = predictionList?.find((prediction:any) => prediction.matchId === match.id);

                return (
                    <MatchCard
                        key={match.id}
                        userId={userId}
                        matchId={match.id}
                        matchGroup={match.group}
                        matchUtcDate={match.utcDate}
                        matchStatus={match.status}
                        homeTeamCrest={match.homeTeam?.crest}
                        homeTeamName={match.homeTeam?.name}
                        awayTeamCrest={match.awayTeam?.crest}
                        awayTeamName={match.awayTeam?.name}
                        homeTeamScore={match.score?.fullTime?.home}
                        awayTeamScore={match.score?.fullTime?.away}
                        userPrediction={matchUserPrediction}
                        updateComponent={updateComponent}
                    />
                );
            })}
        </div>
    )
}