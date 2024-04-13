import styles from "./Matches.module.css"
import {useFetchMatchesFromApiQuery, useGetUserPredictionsQuery} from "../../gql/generated/schema";
import {useEffect, useState} from "react";
import {GradientCard} from "../../components/ui/gradient-card";
import * as React from "react";
import {SparklesCore} from "../../components/ui/sparkles";

export interface MatchesProps {
    userId: number,
    predictionsAreActivated: boolean | undefined
}

export default function Matches({userId, predictionsAreActivated}: MatchesProps) {
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

    useEffect(() => {
        refetch()
        setRefresh(false)
    }, [refresh])

    return (
        <div className={styles.macthes}>
            <div
                style={{background:"#0b0b0f"}}
                className="w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
                <div className={styles.title_container}>
                    <h1 className={styles.title}>
                        Mes
                    </h1>
                    <h1 className={styles.title_slim}>&nbsp;Pronos</h1>
                </div>
                <div className="w-[40rem] h-40 relative">
                    {/* Gradients */}
                    <div
                        className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm"/>
                    <div
                        className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4"/>
                    <div
                        className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm"/>
                    <div
                        className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4"/>

                    {/* Core component */}
                    <SparklesCore
                        background="transparent"
                        minSize={0.4}
                        maxSize={1}
                        particleDensity={1200}
                        className="w-full h-full"
                        particleColor="#FFFFFF"
                    />

                    {/* Radial Gradient to prevent sharp edges */}
                    <div
                        style={{background:"#0b0b0f"}}
                        className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
                </div>
            </div>
            {matchList && matchList.map((match) => {
                // Filtrer les prédictions de l'utilisateur pour le match actuel
                const matchUserPrediction = predictionList?.find((prediction: any) => prediction.matchId === match.id);

                return (
                    <GradientCard
                        className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900" style={{width: "20vw"}}
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
                        predictionIsActivated={predictionsAreActivated}/>

                    // <MatchCard
                    //     key={match.id}
                    //     userId={userId}
                    //     matchId={match.id}
                    //     matchGroup={match.group}
                    //     matchUtcDate={match.utcDate}
                    //     matchStatus={match.status}
                    //     homeTeamCrest={match.homeTeam?.crest}
                    //     homeTeamName={match.homeTeam?.name}
                    //     awayTeamCrest={match.awayTeam?.crest}
                    //     awayTeamName={match.awayTeam?.name}
                    //     homeTeamScore={match.score?.fullTime?.home}
                    //     awayTeamScore={match.score?.fullTime?.away}
                    //     userPrediction={matchUserPrediction}
                    //     updateComponent={updateComponent}
                    //     predictionIsActivated={predictionsAreActivated}
                    // />

                );
            })}
        </div>
    )
}