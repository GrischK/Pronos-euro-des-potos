import {Arg, Mutation, Query, Resolver} from "type-graphql";
import db from "../db";
import Prediction, {CreatePredictionInput} from "../entities/Predictions";

@Resolver()
export default class predictionResolver {
    @Query(() => [Prediction])
    async getAllPredictions(): Promise<Prediction[]> {
        return await db.getRepository(Prediction).find();
    }

    @Mutation(() => Prediction)
    async createTeam(@Arg('data') data: CreatePredictionInput): Promise<Prediction> {
        const prediction = await db.getRepository(Prediction).save(data)
        return prediction
    }
}