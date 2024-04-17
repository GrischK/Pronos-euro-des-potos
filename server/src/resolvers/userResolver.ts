import {Arg, Authorized, Ctx, Int, Mutation, Query, Resolver} from "type-graphql";
import User, {
    getSafeAttributes,
    hashPassword,
    LoginInput,
    UpdateUserInput,
    UserInput, UserSendPassword,
    verifyPassword
} from "../entities/Users";
import db from "../db";
import {ApolloError} from "apollo-server-errors";
import jwt from "jsonwebtoken";
import {env} from "../env";
import {ContextType} from "../index";
import nodemailer from "nodemailer";

@Resolver()
export default class userResolver {
    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        console.log('usersssssssssssssss');
        return await db.getRepository(User).find();
    }

    @Mutation(() => User)
    async createUSer(@Arg('data') {userName, email, password}: UserInput): Promise<User> {
        console.log(email, password)

        const hashedPassword = await hashPassword(password)
        const defaultRole = "user";

        const user = await db.getRepository(User).save({userName, email, hashedPassword, role: defaultRole})
        return user
    }

    @Mutation(() => String)
    async login(
        @Ctx() ctx: ContextType,
        @Arg('data') {email, password}: LoginInput):

        Promise<string> {
        const user = await db.getRepository(User).findOne({where: {email}})

        if (user === null || !(await verifyPassword(password, user.hashedPassword))) {
            throw new ApolloError('Invalid credentials', 'INVALID CREDS')
        } else {
            const token = jwt.sign({userId: user.id}, env.JWT_PRIVATE_KEY)

            ctx.res.cookie("token", token, {
                secure: env.NODE_ENV === "production",
                domain: env.SERVER_HOST,
                httpOnly: true,
            });

            console.log(token, 'token from login')
            return token
        }
    }

    @Mutation(() => String)
    async logout(
        @Ctx() ctx: ContextType): Promise<string> {
        ctx.res.clearCookie('token');
        return "logged out"
    }

    @Authorized()
    @Query(() => User)
    async profile(@Ctx() ctx: ContextType): Promise<User> {
        const x = getSafeAttributes(ctx.currentUser as User)
        console.log('x is : ', x)
        return x
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

    @Mutation(() => User)
    async sendPasswordEmail(@Arg("data") data: UserSendPassword): Promise<User> {
        const {email} = data;

        const userToEmail = await db
            .getRepository(User)
            .findOne({where: {email}});

        if (!userToEmail) throw new ApolloError("invalid credentials");

        // sender information used to authenticate
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                user: env.EMAIL_ADDRESS,
                pass: env.EMAIL_PASS,
            },
        });

        const userId = userToEmail.id;
        const hashedPassword = userToEmail.hashedPassword;

        const emailToken = jwt.sign({userId}, hashedPassword, {expiresIn: 36000});

        try {
            // create token
            const url = `http://localhost:3000/change-password/:${userId}/:${emailToken}`;

            //  send password reset email
            await transporter.sendMail({
                from: {
                    name: 'Pronos des potos',
                    address: env.EMAIL_ADDRESS
                },
                to: email,
                subject: "Changement mot de passe",
                html: ` Salut ${userToEmail.userName}, tu as demandé le changement de ton mot de passe. <br><br>Pour poursuivre, clique sur le lien suivant : <br><br><a style="background-color: #020617; color: white; text-decoration: none; padding: 1rem; border-radius: 10px display: inline-block;" href="${url}">Changer mon mot de passe</a>`,
                text: ` Salut ${userToEmail.userName}, tu as demandé le changement de ton mot de passe. <br><br>Pour poursuivre, clique sur le lien suivant : <br><br><a style="background-color: #020617; color: white; text-decoration: none; padding: 1rem; border-radius: 10px display: inline-block;" href="${url}">Changer mon mot de passe</a>`,
                // attachments: [{
                //     filename: 'ball.png',
                //     path: '../assets/images/ball.png',
                //     cid: 'ball'
                // }]
            });
        } catch (e) {
            console.log(e);
        }

        // add token to user in db
        userToEmail.changePasswordToken = emailToken;

        // save token in db
        await db.getRepository(User).save(userToEmail);

        return userToEmail;
    }

    // // Query to fetch and send changeEmailToken to client

    @Query(() => User)
    async fetchToken(@Arg("id", () => Number) id: number): Promise<User> {
        const userToUpdatePassword = await db
            .getRepository(User)
            .findOne({where: {id}});
        if (userToUpdatePassword === null)
            throw new ApolloError("user not found", "NOT_FOUND");
        return userToUpdatePassword;
    }

    // mutation to change password
    @Mutation(() => Boolean)
    async changePassword(
        @Arg('id', () => Int) id: number,
        @Arg('newPassword', () => String) newPassword: string
    ): Promise<boolean> {

        // create userToUpdate which is the user in the db matching the email (with properties email, hashedPassword, etc)
        const userToUpdate = await db
            .getRepository(User)
            .findOne({where: {id}});
        // verify if user is null > throw error
        if (!userToUpdate)
            throw new ApolloError("invalid credentials no such user");

        // match UserSendPassword token to token in headers
        if (!userToUpdate.changePasswordToken)
            throw new ApolloError("invalid credentials no such token");

        // hash new password
        const newHashedPassword = await hashPassword(newPassword);

        // update password in user data
        userToUpdate.hashedPassword = newHashedPassword;

        // save new password in db
        await db.getRepository(User).save(userToUpdate);

        return true;
    }
}