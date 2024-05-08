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
const db_1 = __importDefault(require("../db"));
const Matchs_1 = __importStar(require("../entities/Matchs"));
const Teams_1 = __importDefault(require("../entities/Teams"));
const apollo_server_errors_1 = require("apollo-server-errors");
const env_1 = require("../env");
let matchResolver = class matchResolver {
    async getAllMatchs() {
        return await db_1.default
            .getRepository(Matchs_1.default)
            .find({ relations: ["teamA", "teamB"] });
    }
    async createMatch(data) {
        const teamA = await db_1.default
            .getRepository(Teams_1.default)
            .findOne({ where: { id: data.teamA } });
        const teamB = await db_1.default
            .getRepository(Teams_1.default)
            .findOne({ where: { id: data.teamB } });
        if (!teamA) {
            throw new Error("1st team not found.");
        }
        if (!teamB) {
            throw new Error("2nd team not found.");
        }
        const match = new Matchs_1.default();
        match.teamA = teamA;
        match.teamB = teamB;
        return await db_1.default.getRepository(Matchs_1.default).save(match);
    }
    async fetchMatchesFromAPI() {
        try {
            const token = env_1.env.FOOTBALL_DATA_API_TOKEN;
            if (!token) {
                throw new apollo_server_errors_1.ApolloError("Le token de l'API de football est manquant dans le fichier .env");
            }
            const response = await fetch("https://api.football-data.org/v4/competitions/EC/matches", {
                headers: {
                    "X-Auth-Token": token,
                },
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données de l'API");
            }
            const { matches } = await response.json();
            return matches;
        }
        catch (error) {
            console.error("Erreur lors de la récupération des matches depuis l'API:", error);
            throw error;
        }
    }
    async fetchMatchByIdFromAPI(matchId) {
        try {
            const token = env_1.env.FOOTBALL_DATA_API_TOKEN;
            if (!token) {
                throw new apollo_server_errors_1.ApolloError("Le token de l'API de football est manquant dans le fichier .env");
            }
            const response = await fetch("https://api.football-data.org/v4/competitions/EC/matches", {
                headers: {
                    "X-Auth-Token": token,
                },
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données de l'API");
            }
            const { matches } = await response.json();
            const match = matches.find((match) => match.id === matchId);
            if (!match) {
                return null;
            }
            return match;
        }
        catch (error) {
            console.error("Erreur lors de la récupération des matches depuis l'API:", error);
            throw error;
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Matchs_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], matchResolver.prototype, "getAllMatchs", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Matchs_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Matchs_1.CreateMatchInput]),
    __metadata("design:returntype", Promise)
], matchResolver.prototype, "createMatch", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Matchs_1.MatchData]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], matchResolver.prototype, "fetchMatchesFromAPI", null);
__decorate([
    (0, type_graphql_1.Query)(() => Matchs_1.MatchData, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("matchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], matchResolver.prototype, "fetchMatchByIdFromAPI", null);
matchResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], matchResolver);
exports.default = matchResolver;
