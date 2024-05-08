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
const Settings_1 = __importStar(require("../entities/Settings"));
const db_1 = __importDefault(require("../db"));
let settingResolver = class settingResolver {
    async getAppStatus() {
        try {
            const settings = await db_1.default
                .getRepository(Settings_1.default)
                .findOne({ where: { id: 1 } });
            return settings || null;
        }
        catch (error) {
            console.error("Erreur lors de la récupération du statut de l'application :", error);
            return null;
        }
    }
    async setAppSetting(data) {
        const appSetting = new Settings_1.default();
        appSetting.predictionsAreActivated = data.predictionsAreActivated;
        return await db_1.default.getRepository(Settings_1.default).save(appSetting);
    }
    async updateAppSetting(data) {
        try {
            const id = 1;
            await db_1.default.getRepository(Settings_1.default).update(id, data);
            const updatedAppSetting = await db_1.default
                .getRepository(Settings_1.default)
                .findOne({ where: { id } });
            return updatedAppSetting || null;
        }
        catch (error) {
            console.error("Erreur lors de la récupération du statut de l'application :", error);
            return null;
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Settings_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], settingResolver.prototype, "getAppStatus", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Settings_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Settings_1.SetAppStatusInput]),
    __metadata("design:returntype", Promise)
], settingResolver.prototype, "setAppSetting", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Settings_1.default),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Settings_1.UpdateAppStatusInput]),
    __metadata("design:returntype", Promise)
], settingResolver.prototype, "updateAppSetting", null);
settingResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], settingResolver);
exports.default = settingResolver;
