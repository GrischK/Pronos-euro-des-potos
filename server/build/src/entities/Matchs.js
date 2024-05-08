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
exports.MatchData = exports.PronoInput = exports.CreateMatchInput = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Teams_1 = __importDefault(require("./Teams"));
let Match = class Match {
    id;
    teamA;
    teamB;
    scoreA;
    scoreB;
    date;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Match.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Teams_1.default),
    (0, typeorm_1.ManyToOne)(() => Teams_1.default, (t) => t.id),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Teams_1.default)
], Match.prototype, "teamA", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Teams_1.default),
    (0, typeorm_1.ManyToOne)(() => Teams_1.default, (t) => t.id),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Teams_1.default)
], Match.prototype, "teamB", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "scoreA", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "scoreB", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "date", void 0);
Match = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], Match);
let CreateMatchInput = class CreateMatchInput {
    teamA;
    teamB;
    scoreA;
    scoreB;
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], CreateMatchInput.prototype, "teamA", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], CreateMatchInput.prototype, "teamB", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateMatchInput.prototype, "scoreA", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateMatchInput.prototype, "scoreB", void 0);
CreateMatchInput = __decorate([
    (0, type_graphql_1.InputType)()
], CreateMatchInput);
exports.CreateMatchInput = CreateMatchInput;
let PronoInput = class PronoInput {
    scoreA;
    scoreB;
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PronoInput.prototype, "scoreA", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PronoInput.prototype, "scoreB", void 0);
PronoInput = __decorate([
    (0, type_graphql_1.InputType)()
], PronoInput);
exports.PronoInput = PronoInput;
let MatchTeam = class MatchTeam {
    id;
    name;
    shortName;
    tla;
    crest;
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], MatchTeam.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchTeam.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchTeam.prototype, "shortName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchTeam.prototype, "tla", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchTeam.prototype, "crest", void 0);
MatchTeam = __decorate([
    (0, type_graphql_1.ObjectType)()
], MatchTeam);
let MatchFullTime = class MatchFullTime {
    home;
    away;
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], MatchFullTime.prototype, "home", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], MatchFullTime.prototype, "away", void 0);
MatchFullTime = __decorate([
    (0, type_graphql_1.ObjectType)()
], MatchFullTime);
let MatchScore = class MatchScore {
    winner;
    duration;
    fullTime;
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchScore.prototype, "winner", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchScore.prototype, "duration", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", MatchFullTime)
], MatchScore.prototype, "fullTime", void 0);
MatchScore = __decorate([
    (0, type_graphql_1.ObjectType)()
], MatchScore);
let MatchData = class MatchData {
    id;
    utcDate;
    status;
    stage;
    group;
    homeTeam;
    awayTeam;
    score;
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], MatchData.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchData.prototype, "utcDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchData.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchData.prototype, "stage", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatchData.prototype, "group", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", MatchTeam)
], MatchData.prototype, "homeTeam", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", MatchTeam)
], MatchData.prototype, "awayTeam", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", MatchScore)
], MatchData.prototype, "score", void 0);
MatchData = __decorate([
    (0, type_graphql_1.ObjectType)()
], MatchData);
exports.MatchData = MatchData;
exports.default = Match;
