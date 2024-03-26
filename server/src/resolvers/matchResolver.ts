import {Arg, Mutation, Query, Resolver} from "type-graphql";
import db from "../db";
import Match, {CreateMatchInput} from "../entities/Matchs";
import Team from "../entities/Teams";

@Resolver()
export default class matchResolver {
    @Query(() => [Match])
    async getAllMatchs(): Promise<Match[]> {
        return await db.getRepository(Match).find();
    }

    @Mutation(() => Match)
    async createMatch(@Arg('data') data: CreateMatchInput): Promise<Match> {
        const teamA = await db.getRepository(Team).findOne({where: {id: data.teamA}})
        const teamB = await db.getRepository(Team).findOne({where: {id: data.teamB}})

        if (!teamA) {
            throw new Error("One or both teams not found.");
        }
        if (!teamB) {
            throw new Error("One or both teams not found.");
        }

        const match = new Match();
        match.teamA = teamA;
        match.teamB = teamB;

        return await db.getRepository(Match).save(match)
    }
}