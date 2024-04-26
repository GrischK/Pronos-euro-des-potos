import "reflect-metadata";
import http from "http";
import cors from "cors";
import express, {json, urlencoded} from "express";
import {ApolloServer} from "apollo-server-express";
import {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault,} from "apollo-server-core";
import {buildSchema} from "type-graphql";
import db from "./db";
import {env} from "./env";
import {join} from "path";
import User from "./entities/Users";
import jwt from "jsonwebtoken";
import * as path from "node:path";
import multer from "multer";
import * as fs from "node:fs";

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
            // const tokenInCookie = context.req.headers.cookie?.split('=')[1];
            const cookies = context.req.headers.cookie;
            const tokenInCookie = cookies ? cookies.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1] : undefined;

            const tokenInHeaders = context.req.headers.authorization?.split(' ')[1];
            console.log('tokenInHeaders is : ', tokenInHeaders)
            console.log('tokenInCookie is : ', tokenInCookie)
            const token = tokenInHeaders || tokenInCookie;

            let decoded

            try {
                if (token) {
                    decoded = jwt.verify(token, env.JWT_PRIVATE_KEY)
                }
                if (typeof decoded === 'object') {
                    context.jwtPayload = decoded
                }
            } catch (error) {
                console.log(error)
            }

            let user

            if (context.jwtPayload) {
                user = await db.getRepository(User).findOne({where: {id: context.jwtPayload.userId}})
            }
            if (user !== null) {
                context.currentUser = user
            }

            if (!context.currentUser) return false;

            return roles.length === 0 || roles.includes(context.currentUser?.role)
        }
    });

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: "bounded",
        // introspection: process.env.NODE_ENV !== 'production',
        plugins: [
            ApolloServerPluginDrainHttpServer({httpServer}),
            ApolloServerPluginLandingPageLocalDefault({embed: true}),
        ],
        context: ({req, res}) => {
            return {req, res};
        },
    });

    app.use(urlencoded({extended: false}));
    app.use(json());

    const imageUploadPath = path.join(__dirname, './assets/avatars');

    const storage = multer.diskStorage({
        destination: function (req: any, file: any, cb: any) {
            cb(null, imageUploadPath)
        },
        filename: function (req: any, file: any, cb: any) {
            const fileName = req.headers['filename']
            console.log(fileName)
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            cb(null, fileName)
        }
    })

    const imageUpload = multer({storage})

    app.post('/image-upload', imageUpload.array("my-image-file"), (req, res) => {
        res.send('Image successfully saved.');
    })

    app.get('/avatars/:imageName', (req, res) => {
        const imageName = req.params.imageName;
        const imagePath = path.join(__dirname, './assets/avatars', imageName);

        fs.exists(imagePath, (exists) => {
            if (exists) {
                // Si le fichier existe, envoyez-le en tant que réponse
                res.sendFile(imagePath);
            } else {
                // Si le fichier n'existe pas, renvoyez une réponse 404
                res.status(404).send('Image not found');
            }
        });
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