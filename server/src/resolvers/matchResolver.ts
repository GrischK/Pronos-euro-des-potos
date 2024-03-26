import {Arg, Mutation, Query, Resolver} from "type-graphql";
import db from "../db";
import Match, {CreateMatchInput} from "../entities/Matchs";
import Team from "../entities/Teams";

@Resolver()
export default class matchResolver {
    @Query(() => [Match])
    async getAllMatchs(): Promise<Match[]> {
        return await db.getRepository(Match).find({relations:["teamA", "teamB"]});
    }

    @Mutation(() => Match)
    async createMatch(@Arg('data') data: CreateMatchInput): Promise<Match> {
        const teamA = await db.getRepository(Team).findOne({where: {id: data.teamA}})
        const teamB = await db.getRepository(Team).findOne({where: {id: data.teamB}})

        if (!teamA) {
            throw new Error("1st team not found.");
        }
        if (!teamB) {
            throw new Error("2nd team not found.");
        }

        const match = new Match();
        match.teamA = teamA;
        match.teamB = teamB;

        return await db.getRepository(Match).save(match)
    }
}