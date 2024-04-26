import * as React from "react";
import styles from "./Admin.module.css";
import Switch from "@mui/material/Switch";
import {
  UpdateAppStatusInput,
  useUpdateAppStatusMutation,
} from "../../gql/generated/schema";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import { useNavigate } from "react-router-dom";

interface AdminProps {
  handlePredictionSetting: () => void;
  groupPredictionsAreActivated: boolean | undefined;
  roundOf16PredictionsAreActivated: boolean | undefined;
  quarterPredictionsAreActivated: boolean | undefined;
  semiFinalsPredictionsAreActivated: boolean | undefined;
  finalPredictionsAreActivated: boolean | undefined;
}

export default function Admin({
  handlePredictionSetting,
  groupPredictionsAreActivated,
  roundOf16PredictionsAreActivated,
  quarterPredictionsAreActivated,
  semiFinalsPredictionsAreActivated,
  finalPredictionsAreActivated,
}: AdminProps) {
  const [changePredictionsStatus] = useUpdateAppStatusMutation();
  console.log("app is : ", groupPredictionsAreActivated);
  console.log("round of 16 is : ", roundOf16PredictionsAreActivated);

  const handleChangePredictions = (property: string, value: boolean) => {
    changePredictionsStatus({
      variables: {
        data: { [property]: value } as UpdateAppStatusInput,
      },
    });
    handlePredictionSetting();
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.admin_container}>
      <div className={"back_button"}>
        <ButtonHoverGradient onClick={goBack}>Retour</ButtonHoverGradient>
      </div>
      <div className={styles.title_container}>
        <h1 className={styles.admin_title}>Ad</h1>
        <h1 className={styles.admin_title_slim}>min</h1>
      </div>
      <div className={styles.switches_container}>
        <div className={styles.switch_wrapper}>
          <span>Matchs de groupe</span>
          <Switch
            checked={groupPredictionsAreActivated}
            onChange={() =>
              handleChangePredictions(
                "predictionsAreActivated",
                !groupPredictionsAreActivated,
              )
            }
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
        <div className={styles.switch_wrapper}>
          <span>16èmes de finale</span>
          <Switch
            checked={roundOf16PredictionsAreActivated}
            onChange={() =>
              handleChangePredictions(
                "predictionsRoundOf16Activated",
                !roundOf16PredictionsAreActivated,
              )
            }
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
        <div className={styles.switch_wrapper}>
          <span>Quarts de finale</span>
          <Switch
            checked={quarterPredictionsAreActivated}
            onChange={() =>
              handleChangePredictions(
                "predictionsQuarterFinalsActivated",
                !quarterPredictionsAreActivated,
              )
            }
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
        <div className={styles.switch_wrapper}>
          <span>Demi finale</span>
          <Switch
            checked={semiFinalsPredictionsAreActivated}
            onChange={() =>
              handleChangePredictions(
                "predictionsSemiFinalsActivated",
                !semiFinalsPredictionsAreActivated,
              )
            }
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
        <div className={styles.switch_wrapper}>
          <span>Finale</span>
          <Switch
            checked={finalPredictionsAreActivated}
            onChange={() =>
              handleChangePredictions(
                "predictionsFinalActivated",
                !finalPredictionsAreActivated,
              )
            }
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </div>
    </div>
  );
}
