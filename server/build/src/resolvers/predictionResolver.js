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
const Predictions_1 = __importStar(require("../entities/Predictions"));
const Users_1 = __importDefault(require("../entities/Users"));
const apollo_server_errors_1 = require("apollo-server-errors");
let predictionResolver = class predictionResolver {
    async getAllPredictions() {
        return await db_1.default.getRepository(Predictions_1.default).find();
    }
    async getUserPredictions(id) {
        const user = await db_1.default.getRepository(Users_1.default).find({ where: { id } });
        if (!user) {
            throw new Error("User not found");
        }
        return await db_1.default.getRepository(Predictions_1.default).find({ where: { user } });
    }
    async createPrediction(data) {
        const predictionData = {
            matchId: data.matchId,
            homeTeamScorePrediction: data.homeTeamScorePrediction,
            awayTeamScorePrediction: data.awayTeamScorePrediction,
        };
        if (data.user) {
            const user = await db_1.default
                .getRepository(Users_1.default)
                .findOne({ where: { id: data.user } });
            if (user) {
                predictionData.user = user;
            }
            else {
                // Gérer le cas où l'utilisateur n'est pas trouvé
                throw new Error("Utilisateur non trouvé");
            }
        }
        const prediction = await db_1.default.getRepository(Predictions_1.default).save(predictionData);
        return prediction;
    }
    async updatePrediction(data, id) {
        const predictionData = {
            homeTeamScorePrediction: data.homeTeamScorePrediction,
            awayTeamScorePrediction: data.awayTeamScorePrediction,
        };
        const predictionToUpdate = await db_1.default
            .getRepository(Predictions_1.default)
            .findOne({ where: { id } });
        const { affected } = await db_1.default
            .getRepository(Predictions_1.default)
            .update(id, predictionData);
        if (affected === 0)
            throw new apollo_server_errors_1.ApolloError("Prediction not found", "NOT_FOUND");
        return predictionToUpdate;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Predictions_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], predictionResolver.prototype, "getAllPredictions", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Predictions_1.default]),
    __param(0, (0, type_graphql_1.Arg)("userId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], predictionResolver.prototype, "getUserPredictions", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Predictions_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Predictions_1.CreatePredictionInput]),
    __metadata("design:returntype", Promise)
], predictionResolver.prototype, "createPrediction", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Predictions_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __param(1, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Predictions_1.UpdatePredictionInput, Number]),
    __metadata("design:returntype", Promise)
], predictionResolver.prototype, "updatePrediction", null);
predictionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], predictionResolver);
exports.default = predictionResolver;
