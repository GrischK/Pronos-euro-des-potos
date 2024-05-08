"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const promises_1 = require("fs/promises");
const Users_1 = __importStar(require("../entities/Users"));
const apollo_server_errors_1 = require("apollo-server-errors");
const path = __importStar(require("node:path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const db_1 = __importDefault(require("../db"));
const env_1 = require("../env");
let userResolver = class userResolver {
    async getAllUsers() {
        return await db_1.default.getRepository(Users_1.default).find();
    }
    async createUSer({ userName, email, password }) {
        try {
            if (userName.length < 2) {
                throw new apollo_server_errors_1.ApolloError("2 caractères minimum pour le pseudo.");
            }
            if (password.length < 8) {
                throw new apollo_server_errors_1.ApolloError("8 caractères minimum pour le mot de passe.");
            }
            const existingUser = await db_1.default.getRepository(Users_1.default).findOne({
                where: {
                    userName,
                },
            });
            if (existingUser) {
                throw new apollo_server_errors_1.ApolloError("Pseudo déjà utilisé.");
            }
            // Vérifiez si l'adresse e-mail est unique
            const existingEmail = await db_1.default
                .getRepository(Users_1.default)
                .findOne({ where: { email } });
            if (existingEmail) {
                throw new apollo_server_errors_1.ApolloError("E-mail est déjà utilisée.");
            }
            const hashedPassword = await (0, Users_1.hashPassword)(password);
            const defaultRole = "user";
            const user = await db_1.default
                .getRepository(Users_1.default)
                .save({ userName, email, hashedPassword, role: defaultRole });
            return user;
        }
        catch (error) {
            throw new apollo_server_errors_1.ApolloError(error.message);
        }
    }
    async login(ctx, { email, password }) {
        const user = await db_1.default.getRepository(Users_1.default).findOne({ where: { email } });
        if (user === null ||
            !(await (0, Users_1.verifyPassword)(password, user.hashedPassword))) {
            throw new apollo_server_errors_1.ApolloError("Invalid credentials", "INVALID CREDS");
        }
        else {
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.JWT_PRIVATE_KEY);
            ctx.res.cookie("token", token, {
                secure: env_1.env.NODE_ENV === "production",
                domain: env_1.env.SERVER_HOST,
                httpOnly: true,
            });
            return token;
        }
    }
    async logout(ctx) {
        ctx.res.clearCookie("token");
        return "logged out";
    }
    async profile(ctx) {
        const x = (0, Users_1.getSafeAttributes)(ctx.currentUser);
        return x;
    }
    async deleteUser(id) {
        const user = await db_1.default.getRepository(Users_1.default).find({ where: { id } });
        if (user.length < 1)
            throw new apollo_server_errors_1.ApolloError("user not found", "NOT_FOUND");
        await db_1.default.getRepository(Users_1.default).delete(id);
        return true;
    }
    async updateUser(id, data) {
        const userToUpdate = await db_1.default
            .getRepository(Users_1.default)
            .findOne({ where: { id } });
        if (data.userName && data.userName.length < 2) {
            throw new apollo_server_errors_1.ApolloError("2 caractères minimum pour le pseudo.");
        }
        const userName = data.userName;
        if (data.userName) {
            const existingUser = await db_1.default.getRepository(Users_1.default).findOne({
                where: {
                    userName,
                },
            });
            if (existingUser) {
                throw new apollo_server_errors_1.ApolloError("Pseudo déjà utilisé.");
            }
        }
        const { affected } = await db_1.default.getRepository(Users_1.default).update(id, data);
        if (affected === 0)
            throw new apollo_server_errors_1.ApolloError("User not found", "NOT_FOUND");
        return userToUpdate;
    }
    async sendPasswordEmail(data) {
        const { email } = data;
        const userToEmail = await db_1.default
            .getRepository(Users_1.default)
            .findOne({ where: { email } });
        if (!userToEmail)
            throw new apollo_server_errors_1.ApolloError("invalid credentials");
        // sender information used to authenticate
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                user: env_1.env.EMAIL_ADDRESS,
                pass: env_1.env.EMAIL_PASS,
            },
        });
        const userId = userToEmail.id;
        const hashedPassword = userToEmail.hashedPassword;
        const emailToken = jsonwebtoken_1.default.sign({ userId }, hashedPassword, {
            expiresIn: 36000,
        });
        // Path for email template
        const templatePath = path.join(__dirname, "..", "utils", "email-template.html");
        try {
            const template = await (0, promises_1.readFile)(templatePath, "utf8"); // Spécifiez l'encodage 'utf8' explicitement
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
                    address: env_1.env.EMAIL_ADDRESS,
                },
                to: email,
                subject: "Changement mot de passe",
                html,
                text: html,
            });
        }
        catch (e) {
            throw new apollo_server_errors_1.ApolloError(`Issue with email`);
        }
        // add token to user in db
        userToEmail.changePasswordToken = emailToken;
        // save token in db
        await db_1.default.getRepository(Users_1.default).save(userToEmail);
        return userToEmail;
    }
    // Query to fetch and send changeEmailToken to client
    async fetchToken(id) {
        const userToUpdatePassword = await db_1.default
            .getRepository(Users_1.default)
            .findOne({ where: { id } });
        if (userToUpdatePassword === null)
            throw new apollo_server_errors_1.ApolloError("user not found", "NOT_FOUND");
        return userToUpdatePassword;
    }
    // mutation to change password
    async changePassword(id, newPassword) {
        // create userToUpdate which is the user in the db matching the email (with properties email, hashedPassword, etc)
        const userToUpdate = await db_1.default
            .getRepository(Users_1.default)
            .findOne({ where: { id } });
        // verify if user is null > throw error
        if (!userToUpdate)
            throw new apollo_server_errors_1.ApolloError("invalid credentials no such user");
        // match UserSendPassword token to token in headers
        if (!userToUpdate.changePasswordToken)
            throw new apollo_server_errors_1.ApolloError("invalid credentials no such token");
        if (newPassword.length < 8) {
            throw new apollo_server_errors_1.ApolloError("8 caractères minimum pour le mot de passe.");
        }
        // hash new password
        const newHashedPassword = await (0, Users_1.hashPassword)(newPassword);
        // update password in user data
        userToUpdate.hashedPassword = newHashedPassword;
        // save new password in db
        await db_1.default.getRepository(Users_1.default).save(userToUpdate);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Users_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "getAllUsers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Users_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.UserInput]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "createUSer", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Users_1.LoginInput]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => Users_1.default),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "profile", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "deleteUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Users_1.default),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Users_1.UpdateUserInput]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "updateUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Users_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.UserSendPassword]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "sendPasswordEmail", null);
__decorate([
    (0, type_graphql_1.Query)(() => Users_1.default),
    __param(0, (0, type_graphql_1.Arg)("id", () => Number)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "fetchToken", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("newPassword", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "changePassword", null);
userResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], userResolver);
exports.default = userResolver;
