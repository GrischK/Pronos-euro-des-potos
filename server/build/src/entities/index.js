"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const Users_1 = __importDefault(require("./Users"));
const Predictions_1 = __importDefault(require("./Predictions"));
const Settings_1 = __importDefault(require("./Settings"));
exports.entities = [Users_1.default, Settings_1.default, Predictions_1.default];
