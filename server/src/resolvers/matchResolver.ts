import { Arg, Mutation, Query, Resolver } from "type-graphql";
import db from "../db";
import Match, { CreateMatchInput, MatchData } from "../entities/Matchs";
import Team from "../entities/Teams";
import { ApolloError } from "apollo-server-errors";
import { env } from "../env";

@Resolver()
export default class matchResolver {
  @Query(() => [Match])
  async getAllMatchs(): Promise<Match[]> {
    return await db
      .getRepository(Match)
      .find({ relations: ["teamA", "teamB"] });
  }

  @Mutation(() => Match)
  async createMatch(@Arg("data") data: CreateMatchInput): Promise<Match> {
    const teamA = await db
      .getRepository(Team)
      .findOne({ where: { id: data.teamA } });
    const teamB = await db
      .getRepository(Team)
      .findOne({ where: { id: data.teamB } });

    if (!teamA) {
      throw new Error("1st team not found.");
    }
    if (!teamB) {
      throw new Error("2nd team not found.");
    }

    const match = new Match();
    match.teamA = teamA;
    match.teamB = teamB;

    return await db.getRepository(Match).save(match);
  }

  @Query(() => [MatchData])
  async fetchMatchesFromAPI(): Promise<any[]> {
    try {
      const token = env.FOOTBALL_DATA_API_TOKEN;

      if (!token) {
        throw new ApolloError(
          "Le token de l'API de football est manquant dans le fichier .env",
        );
      }

      const response = await fetch(
        "https://api.football-data.org/v4/competitions/EC/matches",
        {
          headers: {
            "X-Auth-Token": token,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données de l'API");
      }

      const { matches } = await response.json();

      return matches;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des matches depuis l'API:",
        error,
      );
      throw error;
    }
  }

  @Query(() => MatchData, { nullable: true })
  async fetchMatchByIdFromAPI(
    @Arg("matchId") matchId: Number,
  ): Promise<Match | null> {
    try {
      const token = env.FOOTBALL_DATA_API_TOKEN;

      if (!token) {
        throw new ApolloError(
          "Le token de l'API de football est manquant dans le fichier .env",
        );
      }

      const response = await fetch(
        "https://api.football-data.org/v4/competitions/EC/matches",
        {
          headers: {
            "X-Auth-Token": token,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données de l'API");
      }

      const { matches } = await response.json();
      const match = matches.find((match: Match) => match.id === matchId);

      if (!match) {
        return null;
      }

      return match;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des matches depuis l'API:",
        error,
      );
      throw error;
    }
  }
}
