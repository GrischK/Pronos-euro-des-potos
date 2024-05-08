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
exports.UpdateAppStatusInput = exports.SetAppStatusInput = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
let AppSetting = class AppSetting {
    id;
    predictionsAreActivated;
    predictionsRoundOf16Activated;
    predictionsQuarterFinalsActivated;
    predictionsSemiFinalsActivated;
    predictionsFinalActivated;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], AppSetting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "predictions_are_activated", default: true }),
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], AppSetting.prototype, "predictionsAreActivated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "predictions_round_of_16_activated", default: true }),
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], AppSetting.prototype, "predictionsRoundOf16Activated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "predictions_quarter_finales_activated", default: true }),
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], AppSetting.prototype, "predictionsQuarterFinalsActivated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "predictions_semi_finales_activated", default: true }),
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], AppSetting.prototype, "predictionsSemiFinalsActivated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "predictions_final_activated", default: true }),
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], AppSetting.prototype, "predictionsFinalActivated", void 0);
AppSetting = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], AppSetting);
let SetAppStatusInput = class SetAppStatusInput {
    predictionsAreActivated;
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], SetAppStatusInput.prototype, "predictionsAreActivated", void 0);
SetAppStatusInput = __decorate([
    (0, type_graphql_1.InputType)()
], SetAppStatusInput);
exports.SetAppStatusInput = SetAppStatusInput;
let UpdateAppStatusInput = class UpdateAppStatusInput {
    predictionsAreActivated;
    predictionsRoundOf16Activated;
    predictionsQuarterFinalsActivated;
    predictionsSemiFinalsActivated;
    predictionsFinalActivated;
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UpdateAppStatusInput.prototype, "predictionsAreActivated", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UpdateAppStatusInput.prototype, "predictionsRoundOf16Activated", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UpdateAppStatusInput.prototype, "predictionsQuarterFinalsActivated", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UpdateAppStatusInput.prototype, "predictionsSemiFinalsActivated", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UpdateAppStatusInput.prototype, "predictionsFinalActivated", void 0);
UpdateAppStatusInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateAppStatusInput);
exports.UpdateAppStatusInput = UpdateAppStatusInput;
exports.default = AppSetting;
