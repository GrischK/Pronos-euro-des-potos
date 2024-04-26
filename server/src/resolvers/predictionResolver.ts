import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import db from "../db";
import Prediction, {
  CreatePredictionInput,
  UpdatePredictionInput,
} from "../entities/Predictions";
import User from "../entities/Users";
import { ApolloError } from "apollo-server-errors";

interface PredictionData {
  matchId: number;
  homeTeamScorePrediction: number;
  awayTeamScorePrediction: number;
  user?: User;
}

interface UpdatePredictionData {
  homeTeamScorePrediction: number;
  awayTeamScorePrediction: number;
}

@Resolver()
export default class predictionResolver {
  @Query(() => [Prediction])
  async getAllPredictions(): Promise<Prediction[]> {
    return await db.getRepository(Prediction).find();
  }

  @Query(() => [Prediction])
  async getUserPredictions(
    @Arg("userId", () => Int) id: number,
  ): Promise<Prediction[] | null> {
    const user = await db.getRepository(User).find({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }

    return await db.getRepository(Prediction).find({ where: { user } });
  }

  @Mutation(() => Prediction)
  async createPrediction(
    @Arg("data") data: CreatePredictionInput,
  ): Promise<Prediction> {
    const predictionData: PredictionData = {
      matchId: data.matchId,
      homeTeamScorePrediction: data.homeTeamScorePrediction,
      awayTeamScorePrediction: data.awayTeamScorePrediction,
    };

    if (data.user) {
      const user = await db
        .getRepository(User)
        .findOne({ where: { id: data.user } });
      if (user) {
        predictionData.user = user;
      } else {
        // Gérer le cas où l'utilisateur n'est pas trouvé
        throw new Error("Utilisateur non trouvé");
      }
    }

    const prediction = await db.getRepository(Prediction).save(predictionData);
    return prediction;
  }

  @Mutation(() => Prediction)
  async updatePrediction(
    @Arg("data") data: UpdatePredictionInput,
    @Arg("id", () => Int) id: number,
  ): Promise<Prediction | null> {
    const predictionData: UpdatePredictionData = {
      homeTeamScorePrediction: data.homeTeamScorePrediction,
      awayTeamScorePrediction: data.awayTeamScorePrediction,
    };

    const predictionToUpdate = await db
      .getRepository(Prediction)
      .findOne({ where: { id } });
    const { affected } = await db
      .getRepository(Prediction)
      .update(id, predictionData);

    if (affected === 0)
      throw new ApolloError("Prediction not found", "NOT_FOUND");

    return predictionToUpdate;
  }
}
