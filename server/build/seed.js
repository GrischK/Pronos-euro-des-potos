"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./src/db"));
const Settings_1 = __importDefault(require("./src/entities/Settings"));
const Users_1 = __importDefault(require("./src/entities/Users"));
async function seed() {
    await db_1.default.initialize();
    await db_1.default.getRepository(Settings_1.default).delete({});
    await db_1.default.getRepository(Settings_1.default).insert({
        id: 1,
        predictionsAreActivated: true,
        predictionsRoundOf16Activated: true,
        predictionsQuarterFinalsActivated: true,
        predictionsSemiFinalsActivated: true,
        predictionsFinalActivated: true,
    });
    await db_1.default.getRepository(Users_1.default).update({ id: 1 }, { role: "admin" });
    await db_1.default.destroy();
    console.log("done !");
}
seed().catch(console.error);
