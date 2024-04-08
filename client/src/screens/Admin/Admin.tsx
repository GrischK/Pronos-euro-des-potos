import * as React from 'react';
import Switch from '@mui/material/Switch';
import styles from './Admin.module.css'

interface AdminProps {
    handlePrediction: () => void,
    predictionStatus: boolean
}

export default function Admin({handlePrediction, predictionStatus}: AdminProps) {

    return (
        <div className={styles.admin_container}>
            Pronos activés
            <Switch
                checked={predictionStatus}
                onChange={handlePrediction}
                inputProps={{'aria-label': 'controlled'}}
            />
        </div>
    )
}