import "reflect-metadata";
import http from "http";
import cors from "cors";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import {buildSchema} from "type-graphql";
import db from "./db";
import {env} from "./env";
import {join} from "path";
import User from "./entities/Users";
import jwt from "jsonwebtoken";

export interface ContextType {
    req: express.Request;
    res: express.Response;
    currentUser?: User;
    jwtPayload?: jwt.JwtPayload;
}

const start = async (): Promise<void> => {
    await db.initialize();
    const app = express();
    const httpServer = http.createServer(app);
    const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(",");

    app.use(
        cors({
            credentials: true,
            origin: (origin, callback) => {
                if (typeof origin === "undefined" || allowedOrigins.includes(origin))
                    return callback(null, true);
                callback(new Error("Not allowed by CORS"));
            },
        })
    );

    const schema = await buildSchema({
        resolvers: [join(__dirname, "/resolvers/*.ts")],
        authChecker: async ({context}: { context: ContextType }, roles) => {
            console.log(context.req.headers.authorization)

            if (!context.currentUser) return false;
            return roles.length === 0 || roles.includes(context.currentUser?.role)
        }
    });

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: "bounded",
        plugins: [
            ApolloServerPluginDrainHttpServer({httpServer}),
            ApolloServerPluginLandingPageLocalDefault({embed: true}),
        ],
        context: ({req, res}) => {
            return {req, res};
        },
    });

    await server.start();
    server.applyMiddleware({app, cors: false, path: "/"});
    httpServer.listen({port: env.SERVER_PORT}, () =>
        console.log(
            `🚀 Server ready at ${env.SERVER_HOST}:${env.SERVER_PORT}${server.graphqlPath}`
        )
    );
};

start().catch(console.error);