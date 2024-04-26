import styles from "./Admin.module.css"
import Switch from "@mui/material/Switch";
import * as React from "react";
import {UpdateAppStatusInput, useUpdateAppStatusMutation} from "../../gql/generated/schema";

interface AdminProps {
    handlePredictionSetting: () => void,
    groupPredictionsAreActivated: boolean | undefined,
    roundOf16PredictionsAreActivated: boolean | undefined,
    quarterPredictionsAreActivated: boolean | undefined
    semiFinalsPredictionsAreActivated: boolean | undefined
    finalPredictionsAreActivated: boolean | undefined
}

export default function Admin({
                                  handlePredictionSetting,
                                  groupPredictionsAreActivated,
                                  roundOf16PredictionsAreActivated,
                                  quarterPredictionsAreActivated,
                                  semiFinalsPredictionsAreActivated,
                                  finalPredictionsAreActivated
                              }: AdminProps) {
    const [changePredictionsStatus] = useUpdateAppStatusMutation()
    console.log('app is : ', groupPredictionsAreActivated)
    console.log('round of 16 is : ', roundOf16PredictionsAreActivated)

    const handleChangePredictions = (property: string, value: boolean) => {
        changePredictionsStatus({
            variables: {
                data: {[property]: value} as UpdateAppStatusInput
            },
        });
        handlePredictionSetting();
    };

    return (

        <div className={styles.admin_container}>
            Gestion des pronos
            <div>
                <span>Matchs de groupe</span>
                <Switch
                    color="warning"
                    checked={groupPredictionsAreActivated}
                    onChange={() => handleChangePredictions('predictionsAreActivated', !groupPredictionsAreActivated)}
                    inputProps={{'aria-label': 'controlled'}}
                />
            </div>
            <div>
                <span>16èmes de finale</span>
                <Switch
                    color="warning"
                    checked={roundOf16PredictionsAreActivated}
                    onChange={() => handleChangePredictions('predictionsRoundOf16Activated', !roundOf16PredictionsAreActivated)}
                    inputProps={{'aria-label': 'controlled'}}
                />
            </div>
            <div>
                <span>Quarts de finale</span>
                <Switch
                    color="warning"
                    checked={quarterPredictionsAreActivated}
                    onChange={() => handleChangePredictions('predictionsQuarterFinalsActivated', !quarterPredictionsAreActivated)}
                    inputProps={{'aria-label': 'controlled'}}
                />
            </div>
            <div>
                <span>Demi finale</span>
                <Switch
                    color="warning"
                    checked={semiFinalsPredictionsAreActivated}
                    onChange={() => handleChangePredictions('predictionsSemiFinalsActivated', !semiFinalsPredictionsAreActivated)}
                    inputProps={{'aria-label': 'controlled'}}
                />
            </div>
            <div>
                <span>Finale</span>
                <Switch
                    color="warning"
                    checked={finalPredictionsAreActivated}
                    onChange={() => handleChangePredictions('predictionsFinalActivated', !finalPredictionsAreActivated)}
                    inputProps={{'aria-label': 'controlled'}}
                />
            </div>
        </div>
    )
}