import styles from "./Admin.module.css"
import Switch from "@mui/material/Switch";
import * as React from "react";
import {useUpdateAppStatusMutation} from "../../gql/generated/schema";

interface AdminProps {
    handlePredictionSetting: () => void,
    app: boolean | undefined,
}

export default function Admin({handlePredictionSetting, app}: AdminProps) {


    const [changePredictionsStatus] = useUpdateAppStatusMutation()

    const handleChange = () => {
        changePredictionsStatus()
        handlePredictionSetting()
    }
    return (

        <div className={styles.admin_container}>
            Pronos activés
            <Switch
                color="warning"
                checked={app}
                onChange={handleChange}
                inputProps={{'aria-label': 'controlled'}}
            />
        </div>
    )
}