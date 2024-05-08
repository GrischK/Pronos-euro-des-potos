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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const http_1 = __importDefault(require("http"));
const express_1 = __importStar(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const Users_1 = __importDefault(require("./entities/Users"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_core_1 = require("apollo-server-core");
const type_graphql_1 = require("type-graphql");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const env_1 = require("./env");
const predictionResolver_1 = __importDefault(require("./resolvers/predictionResolver"));
const settingResolver_1 = __importDefault(require("./resolvers/settingResolver"));
const userResolver_1 = __importDefault(require("./resolvers/userResolver"));
const matchResolver_1 = __importDefault(require("./resolvers/matchResolver"));
const start = async () => {
    await db_1.default.initialize();
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const allowedOrigins = env_1.env.CORS_ALLOWED_ORIGINS.split(",");
    app.use((0, cors_1.default)({
        credentials: true,
        origin: (origin, callback) => {
            if (typeof origin === "undefined" || allowedOrigins.includes(origin))
                return callback(null, true);
            callback(new Error("Not allowed by CORS"));
        },
    }));
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [
            predictionResolver_1.default,
            settingResolver_1.default,
            userResolver_1.default,
            matchResolver_1.default,
        ],
        authChecker: async ({ context }, roles) => {
            // const tokenInCookie = context.req.headers.cookie?.split('=')[1];
            const cookies = context.req.headers.cookie;
            const tokenInCookie = cookies
                ? cookies
                    .split("; ")
                    .find((cookie) => cookie.startsWith("token="))
                    ?.split("=")[1]
                : undefined;
            const tokenInHeaders = context.req.headers.authorization?.split(" ")[1];
            const token = tokenInHeaders || tokenInCookie;
            let decoded;
            try {
                if (token) {
                    decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_PRIVATE_KEY);
                }
                if (typeof decoded === "object") {
                    context.jwtPayload = decoded;
                }
            }
            catch (error) {
                console.error(error);
            }
            let user;
            if (context.jwtPayload) {
                user = await db_1.default
                    .getRepository(Users_1.default)
                    .findOne({ where: { id: context.jwtPayload.userId } });
            }
            if (user !== null) {
                context.currentUser = user;
            }
            if (!context.currentUser)
                return false;
            return roles.length === 0 || roles.includes(context.currentUser?.role);
        },
    });
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        csrfPrevention: true,
        cache: "bounded",
        // introspection: process.env.NODE_ENV !== 'production',
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            (0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true }),
        ],
        context: ({ req, res }) => {
            return { req, res };
        },
    });
    app.use((0, express_1.urlencoded)({ extended: false }));
    app.use((0, express_1.json)());
    const imageUploadPath = path.join(__dirname, "./assets/avatars");
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, imageUploadPath);
        },
        filename: function (req, file, cb) {
            const fileName = req.headers["filename"];
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            cb(null, fileName);
        },
    });
    const imageUpload = (0, multer_1.default)({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // Limit to 5Mo
        },
    });
    app.post("/image-upload", imageUpload.array("my-image-file"), (req, res) => {
        res.send("Image successfully saved.");
    });
    app.get("/avatars/:imageName", (req, res) => {
        const imageName = req.params.imageName;
        const imagePath = path.join(__dirname, "./assets/avatars", imageName);
        fs.exists(imagePath, (exists) => {
            if (exists) {
                // Si le fichier existe, envoyez-le en tant que réponse
                res.sendFile(imagePath);
            }
            else {
                // Si le fichier n'existe pas, renvoyez une réponse 404
                res.status(404).send("Image not found");
            }
        });
    });
    app.delete("/avatars/:imageName", async (req, res) => {
        try {
            const imageName = req.params.imageName;
            const imagePath = path.join(__dirname, "./assets/avatars", imageName);
            // Vérifie si le fichier existe avant de tenter de le supprimer
            const fileExists = await fs_1.promises
                .access(imagePath, fs_1.promises.constants.F_OK)
                .then(() => true)
                .catch(() => false);
            if (fileExists) {
                // Supprime le fichier
                await fs_1.promises.unlink(imagePath);
                res.status(200).send("Image successfully deleted.");
            }
            else {
                // Si le fichier n'existe pas, renvoie une réponse 404
                res.status(404).send("Image not found");
            }
        }
        catch (error) {
            console.error("Error deleting image:", error);
            res.status(500).send("Internal server error");
        }
    });
    await server.start();
    server.applyMiddleware({ app, cors: false, path: "/" });
    httpServer.listen({ port: env_1.env.SERVER_PORT }, () => console.log(`🚀 Server ready at ${env_1.env.SERVER_HOST}:${env_1.env.SERVER_PORT}${server.graphqlPath}`));
};
start().catch(console.error);
