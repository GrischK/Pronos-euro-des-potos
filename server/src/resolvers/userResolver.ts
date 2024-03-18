import {Arg, Mutation, Query, Resolver} from "type-graphql";
import User, {UserInput} from "../entities/Users";
import db from "../db";

@Resolver()
export default class userResolver {
    @Query(() => [User])
    async users(): Promise<User[]> {
        return await db.getRepository(User).find();
    }

    @Mutation(() => User)
    async createUSer(@Arg('data') data: UserInput): Promise<User> {
        const user = await db.getRepository(User).save(data)
        return user
    }
}