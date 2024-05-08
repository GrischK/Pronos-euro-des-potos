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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeamInput = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
let Team = class Team {
    id;
    name;
    flag;
    group;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Team.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Team.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Team.prototype, "flag", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Team.prototype, "group", void 0);
Team = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], Team);
let CreateTeamInput = class CreateTeamInput {
    name;
    flag;
    group;
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateTeamInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateTeamInput.prototype, "flag", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateTeamInput.prototype, "group", void 0);
CreateTeamInput = __decorate([
    (0, type_graphql_1.InputType)()
], CreateTeamInput);
exports.CreateTeamInput = CreateTeamInput;
exports.default = Team;
// TODO: supprimer ce fichier
