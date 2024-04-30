import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import User, {
  getSafeAttributes,
  hashPassword,
  LoginInput,
  UpdateUserInput,
  UserInput,
  UserSendPassword,
  verifyPassword,
} from "../entities/Users";
import db from "../db";
import { ApolloError } from "apollo-server-errors";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { ContextType } from "../index";
import nodemailer from "nodemailer";
import { readFile } from "fs/promises";
import * as path from "node:path"; // Utilisez l'importation de fs/promises pour les promesses

@Resolver()
export default class userResolver {
  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return await db.getRepository(User).find();
  }

  @Mutation(() => User)
  async createUSer(
    @Arg("data") { userName, email, password }: UserInput,
  ): Promise<User> {
    try {
      if (userName.length < 2) {
        throw new ApolloError("2 caractères minimum pour le pseudo.");
      }

      if (password.length < 8) {
        throw new ApolloError("8 caractères minimum pour le mot de passe.");
      }

      const existingUser = await db.getRepository(User).findOne({
        where: {
          userName,
        },
      });

      if (existingUser) {
        throw new ApolloError("Pseudo déjà utilisé.");
      }

      // Vérifiez si l'adresse e-mail est unique
      const existingEmail = await db
        .getRepository(User)
        .findOne({ where: { email } });
      if (existingEmail) {
        throw new ApolloError("E-mail est déjà utilisée.");
      }

      const hashedPassword = await hashPassword(password);
      const defaultRole = "user";

      const user = await db
        .getRepository(User)
        .save({ userName, email, hashedPassword, role: defaultRole });

      return user;
    } catch (error: any) {
      throw new ApolloError(error.message);
    }
  }

  @Mutation(() => String)
  async login(
    @Ctx() ctx: ContextType,
    @Arg("data") { email, password }: LoginInput,
  ): Promise<string> {
    const user = await db.getRepository(User).findOne({ where: { email } });

    if (
      user === null ||
      !(await verifyPassword(password, user.hashedPassword))
    ) {
      throw new ApolloError("Invalid credentials", "INVALID CREDS");
    } else {
      const token = jwt.sign({ userId: user.id }, env.JWT_PRIVATE_KEY);

      ctx.res.cookie("token", token, {
        secure: env.NODE_ENV === "production",
        domain: env.SERVER_HOST,
        httpOnly: true,
      });

      return token;
    }
  }

  @Mutation(() => String)
  async logout(@Ctx() ctx: ContextType): Promise<string> {
    ctx.res.clearCookie("token");
    return "logged out";
  }

  @Authorized()
  @Query(() => User)
  async profile(@Ctx() ctx: ContextType): Promise<User> {
    const x = getSafeAttributes(ctx.currentUser as User);
    return x;
  }

  @Mutation(() => String)
  async deleteUser(@Arg("id", () => Int) id: number): Promise<boolean> {
    const user = await db.getRepository(User).find({ where: { id } });
    if (user.length < 1) throw new ApolloError("user not found", "NOT_FOUND");

    await db.getRepository(User).delete(id);
    return true;
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdateUserInput,
  ): Promise<User | null> {
    const userToUpdate = await db
      .getRepository(User)
      .findOne({ where: { id } });

    if (data.userName && data.userName.length < 2) {
      throw new ApolloError("2 caractères minimum pour le pseudo.");
    }

    const { affected } = await db.getRepository(User).update(id, data);

    if (affected === 0) throw new ApolloError("User not found", "NOT_FOUND");

    return userToUpdate;
  }

  @Mutation(() => User)
  async sendPasswordEmail(@Arg("data") data: UserSendPassword): Promise<User> {
    const { email } = data;

    const userToEmail = await db
      .getRepository(User)
      .findOne({ where: { email } });

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

    const emailToken = jwt.sign({ userId }, hashedPassword, {
      expiresIn: 36000,
    });

    // Path for email template
    const templatePath = path.join(
      __dirname,
      "..",
      "utils",
      "email-template.html",
    );

    try {
      const template = await readFile(templatePath, "utf8"); // Spécifiez l'encodage 'utf8' explicitement

      // create token
      const url = `http://localhost:3000/change-password/:${userId}/:${emailToken}`;

      // Replace variables in email template
      const html = template
        .replace("{{ userName }}", userToEmail.userName)
        .replace("{{ url }}", url);

      //  send password reset email
      await transporter.sendMail({
        from: {
          name: "Pronos des potos",
          address: env.EMAIL_ADDRESS,
        },
        to: email,
        subject: "Changement mot de passe",
        html,
        text: html,
        // attachments: [{
        //     filename: 'ball.png',
        //     path: '../assets/images/ball.png',
        //     cid: 'ball'
        // }]
      });
    } catch (e: any) {
      throw new ApolloError(`Issue with email`);
    }

    // add token to user in db
    userToEmail.changePasswordToken = emailToken;

    // save token in db
    await db.getRepository(User).save(userToEmail);

    return userToEmail;
  }

  // Query to fetch and send changeEmailToken to client
  @Query(() => User)
  async fetchToken(@Arg("id", () => Number) id: number): Promise<User> {
    const userToUpdatePassword = await db
      .getRepository(User)
      .findOne({ where: { id } });
    if (userToUpdatePassword === null)
      throw new ApolloError("user not found", "NOT_FOUND");
    return userToUpdatePassword;
  }

  // mutation to change password
  @Mutation(() => Boolean)
  async changePassword(
    @Arg("id", () => Int) id: number,
    @Arg("newPassword", () => String) newPassword: string,
  ): Promise<boolean> {
    // create userToUpdate which is the user in the db matching the email (with properties email, hashedPassword, etc)
    const userToUpdate = await db
      .getRepository(User)
      .findOne({ where: { id } });
    // verify if user is null > throw error
    if (!userToUpdate)
      throw new ApolloError("invalid credentials no such user");

    // match UserSendPassword token to token in headers
    if (!userToUpdate.changePasswordToken)
      throw new ApolloError("invalid credentials no such token");

    if (newPassword.length < 8) {
      throw new ApolloError("8 caractères minimum pour le mot de passe.");
    }

    // hash new password
    const newHashedPassword = await hashPassword(newPassword);

    // update password in user data
    userToUpdate.hashedPassword = newHashedPassword;

    // save new password in db
    await db.getRepository(User).save(userToUpdate);

    return true;
  }
}
