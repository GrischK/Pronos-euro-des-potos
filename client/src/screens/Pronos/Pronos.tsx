import {useFetchMatchesFromApiQuery, useGetAllPredictionsQuery} from "../../gql/generated/schema";
import {MeteorCard} from "../../components/ui/Meteor-card";

export default function Pronos() {
    const {data: allPredictions} = useGetAllPredictionsQuery()
    const {data: matches} = useFetchMatchesFromApiQuery()
    const matchList = matches && matches.fetchMatchesFromAPI;

    const predictionsList = allPredictions && allPredictions?.getAllPredictions

    console.log(predictionsList)
    console.log(matchList)
    return (
        <div>
            {matchList &&
                matchList.map((match) => {
                    const matchPredictions = predictionsList?.find((prediction: any) => prediction.matchId === match.id);
                    return matchPredictions ? (
                        <div key={match.id}> {/* Ajoutez une clé unique pour chaque élément */}
                            <MeteorCard matchInfo={match} matchPredictions={matchPredictions} />
                        </div>
                    ) : null;
                })}
            {
                predictionsList && predictionsList.map((prediction) => (
                    <div>
                        {prediction.user?.userName}
                        Match id :
                        {prediction.matchId}
                        Home :
                        {prediction.homeTeamScorePrediction}
                        Away :
                        {prediction.awayTeamScorePrediction}
                    </div>
                ))
            }
        </div>
    )
}