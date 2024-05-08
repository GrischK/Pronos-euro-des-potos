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
exports.getSafeAttributes = exports.verifyPassword = exports.hashPassword = exports.UserChangePasswordId = exports.UserChangePassword = exports.UserSendPassword = exports.LoginInput = exports.UpdateUserInput = exports.UserInput = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const argon2_1 = require("argon2");
const Predictions_1 = __importDefault(require("./Predictions"));
let User = class User {
    id;
    userName;
    email;
    hashedPassword;
    picture;
    role;
    prediction;
    changePasswordToken;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, type_graphql_1.Field)(() => String),
    (0, class_validator_1.MinLength)(2, {
        message: "2 caractères minimum pour le pseudo.",
    }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "hashedPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "picture", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: ["user", "admin"], default: "user", nullable: true }),
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Predictions_1.default], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Predictions_1.default, (p) => p.user, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], User.prototype, "prediction", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], User.prototype, "changePasswordToken", void 0);
User = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], User);
let UserInput = class UserInput {
    userName;
    email;
    password;
    picture;
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInput.prototype, "userName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.MinLength)(8, {
        message: "8 caractères minimum pour le mot de passe.",
    }),
    __metadata("design:type", String)
], UserInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UserInput.prototype, "picture", void 0);
UserInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserInput);
exports.UserInput = UserInput;
let UpdateUserInput = class UpdateUserInput {
    userName;
    email;
    password;
    picture;
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "userName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.MinLength)(8, {
        message: "8 caractères minimum pour le mot de passe.",
    }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "picture", void 0);
UpdateUserInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateUserInput);
exports.UpdateUserInput = UpdateUserInput;
let LoginInput = class LoginInput {
    email;
    password;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.MinLength)(8, {
        message: "8 caractères minimum pour le mot de passe.",
    }),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], LoginInput);
exports.LoginInput = LoginInput;
let UserSendPassword = class UserSendPassword {
    email;
    token;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserSendPassword.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserSendPassword.prototype, "token", void 0);
UserSendPassword = __decorate([
    (0, type_graphql_1.InputType)()
], UserSendPassword);
exports.UserSendPassword = UserSendPassword;
let UserChangePassword = class UserChangePassword {
    id;
    newPassword;
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], UserChangePassword.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserChangePassword.prototype, "newPassword", void 0);
UserChangePassword = __decorate([
    (0, type_graphql_1.InputType)()
], UserChangePassword);
exports.UserChangePassword = UserChangePassword;
let UserChangePasswordId = class UserChangePasswordId {
    id;
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], UserChangePasswordId.prototype, "id", void 0);
UserChangePasswordId = __decorate([
    (0, type_graphql_1.InputType)()
], UserChangePasswordId);
exports.UserChangePasswordId = UserChangePasswordId;
const hashingOptions = {
    type: argon2_1.argon2id,
    timeCost: 5,
    memoryCost: 2 ** 16,
};
async function hashPassword(plainPassword) {
    return await (0, argon2_1.hash)(plainPassword, hashingOptions);
}
exports.hashPassword = hashPassword;
async function verifyPassword(plainPassword, hashedPassword) {
    return await (0, argon2_1.verify)(hashedPassword, plainPassword, hashingOptions);
}
exports.verifyPassword = verifyPassword;
const getSafeAttributes = (user) => ({
    ...user,
    hashedPassword: "",
});
exports.getSafeAttributes = getSafeAttributes;
exports.default = User;
