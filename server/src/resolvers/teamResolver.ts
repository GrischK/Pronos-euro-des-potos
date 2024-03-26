import {Arg, Mutation, Query, Resolver} from "type-graphql";
import db from "../db";
import Team, {CreateTeamInput} from "../entities/Teams";

@Resolver()
export default class teamResolver {
    @Query(() => [Team])
    async getAllTeams(): Promise<Team[]> {
        return await db.getRepository(Team).find();
    }

    @Mutation(() => Team)
    async createTeam(@Arg('data') data: CreateTeamInput): Promise<Team> {
        const team = await db.getRepository(Team).save(data)
        return team
    }
}