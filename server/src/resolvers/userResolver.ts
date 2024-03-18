import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import User, {hashPassword, LoginInput, UpdateUserInput, UserInput, verifyPassword} from "../entities/Users";
import db from "../db";
import {ApolloError} from "apollo-server-errors";

@Resolver()
export default class userResolver {
    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        return await db.getRepository(User).find();
    }

    @Mutation(() => User)
    async createUSer(@Arg('data') {userName, email, password}: UserInput): Promise<User> {
        console.log(email, password)

        const hashedPassword = await hashPassword(password)

        const user = await db.getRepository(User).save({userName, email, hashedPassword})
        return user
    }

    @Mutation(() => Boolean)
    async login(@Arg('data') {email, password}: LoginInput): Promise<boolean> {
        const user = await db.getRepository(User).findOne({where: {email}})

        if (user === null || !(await verifyPassword(password, user.hashedPassword))) {
            throw new ApolloError('Invalid credentials', 'INVALID CREDS')
        } else {
            return true
        }
    }

    @Mutation(() => String)
    async deleteUser(@Arg('id', () => Int) id: number): Promise<boolean> {
        const user = await db.getRepository(User).find({where: {id}});
        console.log(user)
        if (user.length < 1) throw new ApolloError('user not found', 'NOT_FOUND');

        await db.getRepository(User).delete(id)
        return true
    }

    @Mutation(() => User)
    async updateUser(
        @Arg("id", () => Int) id: number,
        @Arg("data") data: UpdateUserInput
    ): Promise<User | null> {
        const userToUpdate = await db.getRepository(User).findOne({where: {id}});
        const {affected} = await db.getRepository(User).update(id, data);

        if (affected === 0) throw new ApolloError("User not found", "NOT_FOUND");

        return userToUpdate
    }
}