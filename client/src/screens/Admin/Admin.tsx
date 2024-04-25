import styles from "./Admin.module.css"
import Switch from "@mui/material/Switch";
import * as React from "react";
import {useUpdateAppStatusMutation} from "../../gql/generated/schema";
import {useState} from "react";

interface AdminProps {
    handlePredictionSetting: () => void,
    app: boolean | undefined,
    roundOf16PredictionsAreActivated: boolean | undefined,
}

export default function Admin({handlePredictionSetting, app, roundOf16PredictionsAreActivated}: AdminProps) {
    const [changePredictionsStatus] = useUpdateAppStatusMutation()
    const [predictionsSetting, setPredictionsSetting] = useState<any>({
        predictionsAreActivated: app,
        predictionsRoundOf16Activated: roundOf16PredictionsAreActivated,
        predictionsQuarterFinalsActivated: false,
        predictionsSemiFinalsActivated: false,
        predictionsFinalActivated: false
    })
    const handleChange = () => {
        changePredictionsStatus({
                variables: {
                    data: {
                        predictionsAreActivated: predictionsSetting.predictionsAreActivated,
                        predictionsRoundOf16Activated: predictionsSetting.roundOf16PredictionsAreActivated,
                        predictionsQuarterFinalsActivated: true,
                        predictionsSemiFinalsActivated: false,
                        predictionsFinalActivated: false
                    }
                },
            }
        )
        handlePredictionSetting()
    }

    console.log(app)

    return (

        <div className={styles.admin_container}>
            Pronos activés
            <Switch
                color="warning"
                checked={app}
                onChange={handleChange}
                inputProps={{'aria-label': 'controlled'}}
            />
            <Switch
                color="warning"
                checked={app}
                onChange={handleChange}
                inputProps={{'aria-label': 'controlled'}}
            />
        </div>
    )
}