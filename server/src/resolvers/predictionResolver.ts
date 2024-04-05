import {Arg, Mutation, Query, Resolver} from "type-graphql";
import db from "../db";
import Prediction, {CreatePredictionInput} from "../entities/Predictions";
import User from "../entities/Users";

interface PredictionData {
    matchId: number;
    homeTeamScorePrediction: number;
    awayTeamScorePrediction: number;
    user?: User; // Rendre la propriété user optionnelle
}

@Resolver()
export default class predictionResolver {
    @Query(() => [Prediction])
    async getAllPredictions(): Promise<Prediction[]> {
        return await db.getRepository(Prediction).find();
    }

    @Mutation(() => Prediction)
    async createPrediction(@Arg('data') data: CreatePredictionInput): Promise<Prediction> {
        const predictionData: PredictionData = {
            matchId: data.matchId,
            homeTeamScorePrediction: data.homeTeamScorePrediction,
            awayTeamScorePrediction: data.awayTeamScorePrediction,
        }

        if (data.user) {
            const user = await db.getRepository(User).findOne({where: {id: data.user}})
            if (user) {
                predictionData.user = user;
            } else {
                // Gérer le cas où l'utilisateur n'est pas trouvé
                throw new Error("Utilisateur non trouvé");
            }
        }

        const prediction = await db.getRepository(Prediction).save(predictionData)
        return prediction
    }
}