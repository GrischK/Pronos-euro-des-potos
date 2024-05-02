import db from "./src/db";
import AppSetting from "./src/entities/Settings";
import Users from "./src/entities/Users";

async function seed(): Promise<void> {
  await db.initialize();
  await db.getRepository(AppSetting).delete({});

  await db.getRepository(AppSetting).insert({
    id: 1,
    predictionsAreActivated: true,
    predictionsRoundOf16Activated: true,
    predictionsQuarterFinalsActivated: true,
    predictionsSemiFinalsActivated: true,
    predictionsFinalActivated: true,
  });

  await db.getRepository(Users).update({ id: 1 }, { role: "admin" });

  await db.destroy();
  console.log("done !");
}

seed().catch(console.error);
