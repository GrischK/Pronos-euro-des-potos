"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePredictionInput = exports.CreatePredictionInput = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Users_1 = __importDefault(require("./Users"));
let Prediction = class Prediction {
    id;
    matchId;
    user;
    homeTeamScorePrediction;
    awayTeamScorePrediction;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Prediction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "match_id" }),
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Prediction.prototype, "matchId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Users_1.default, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => Users_1.default, (u) => u.prediction, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Users_1.default)
], Prediction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "home_team_score_prediction" }),
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Prediction.prototype, "homeTeamScorePrediction", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "away_team_score_prediction" }),
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Prediction.prototype, "awayTeamScorePrediction", void 0);
Prediction = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], Prediction);
let CreatePredictionInput = class CreatePredictionInput {
    matchId;
    user;
    homeTeamScorePrediction;
    awayTeamScorePrediction;
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], CreatePredictionInput.prototype, "matchId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], CreatePredictionInput.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], CreatePredictionInput.prototype, "homeTeamScorePrediction", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], CreatePredictionInput.prototype, "awayTeamScorePrediction", void 0);
CreatePredictionInput = __decorate([
    (0, type_graphql_1.InputType)()
], CreatePredictionInput);
exports.CreatePredictionInput = CreatePredictionInput;
let UpdatePredictionInput = class UpdatePredictionInput {
    homeTeamScorePrediction;
    awayTeamScorePrediction;
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], UpdatePredictionInput.prototype, "homeTeamScorePrediction", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], UpdatePredictionInput.prototype, "awayTeamScorePrediction", void 0);
UpdatePredictionInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdatePredictionInput);
exports.UpdatePredictionInput = UpdatePredictionInput;
exports.default = Prediction;
