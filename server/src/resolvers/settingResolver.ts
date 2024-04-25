import {Arg, Mutation, Query, Resolver} from "type-graphql";
import AppSetting, {SetAppStatusInput, UpdateAppStatusInput} from "../entities/Settings";
import db from "../db";

@Resolver()
export default class settingResolver {
    @Query(() => AppSetting)
    async getAppStatus(): Promise<AppSetting | null> {
        try {
            const settings = await db.getRepository(AppSetting).findOne({where: {id: 1}});
            return settings || null;
        } catch (error) {
            console.error("Erreur lors de la récupération du statut de l'application :", error);
            return null;
        }
    }

    @Mutation(() => AppSetting)
    async setAppSetting(@Arg('data') data: SetAppStatusInput): Promise<AppSetting> {
        const appSetting = new AppSetting();
        appSetting.predictionsAreActivated = data.predictionsAreActivated;

        return await db.getRepository(AppSetting).save(appSetting)
    }

    @Mutation(() => AppSetting)
    async updateAppSetting(@Arg('data') data: UpdateAppStatusInput): Promise<AppSetting | null> {
        try {
            const appSetting = await db.getRepository(AppSetting).findOne({where: {id: 1}});

            if (appSetting) {
                appSetting.predictionsAreActivated = data.predictionsAreActivated;
                appSetting.predictionsRoundOf16Activated = data.predictionsRoundOf16Activated;
                appSetting.predictionsQuarterFinalsActivated = data.predictionsQuarterFinalsActivated;
                appSetting.predictionsSemiFinalsActivated = data.predictionsSemiFinalsActivated;
                appSetting.predictionsFinalActivated = data.predictionsFinalActivated;

                return await db.getRepository(AppSetting).save(appSetting)
            }
            return null
        } catch (error) {
            console.error("Erreur lors de la récupération du statut de l'application :", error);
            return null;
        }
    }
}