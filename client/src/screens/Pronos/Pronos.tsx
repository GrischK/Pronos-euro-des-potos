import {useGetAllPredictionsQuery} from "../../gql/generated/schema";

export default function Pronos(){
    const {data:allPredictions}=useGetAllPredictionsQuery()

    const predictionsList = allPredictions && allPredictions?.getAllPredictions

    console.log(allPredictions)

    return (
        <div>
            {
                predictionsList && predictionsList.map((prediction)=>(
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