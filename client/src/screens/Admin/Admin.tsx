import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./Admin.module.css";
import {
  UpdateAppStatusInput,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateAppStatusMutation,
} from "../../gql/generated/schema";
import Switch from "@mui/material/Switch";
import ButtonHoverGradient from "../../components/ui/Button-hover-gradient";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { boxStyle, modalStyle, typoStyle } from "../../utils/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckRoundedCircleIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

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
  const { data: userList, refetch } = useGetAllUsersQuery();
  const [refreshPage, setRefreshPage] = useState(false);
  const [openModalId, setOpenModalId] = useState<number | null>(null);

  const users = userList && userList.getAllUsers;

  const modalRef = useRef(null);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const [changePredictionsStatus] = useUpdateAppStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleModal = (userId: number) => {
    setOpenModalId(userId === openModalId ? null : userId);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser({
        variables: {
          deleteUserId: id,
        },
      });
      await refetch();
      setRefreshPage(true);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de l'utilisateur :",
        error,
      );
    }
  };

  const handleChangePredictions = (property: string, value: boolean) => {
    changePredictionsStatus({
      variables: {
        data: { [property]: value } as UpdateAppStatusInput,
      },
    });
    handlePredictionSetting();
  };

  useEffect(() => {
    setRefreshPage(false);
  }, [refreshPage]);

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
      <div style={{ display: "flex", flexDirection: "column", gap: "3vh" }}>
        {users &&
          users.map((user) => (
            <div className={styles.user_deletion} key={user.id}>
              <button onClick={() => handleModal(user.id)}>
                <DeleteForeverRoundedIcon
                  fontSize={"medium"}
                  color={"primary"}
                />
              </button>
              <span>{user.userName}</span>
              <Modal
                ref={modalRef}
                sx={modalStyle}
                open={user.id === openModalId}
                onClose={() => setOpenModalId(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={boxStyle}>
                  <Typography sx={typoStyle}>
                    Es tu sûr de vouloir supprimer {user.userName}
                    <div className={"spacing"}>
                      <CheckRoundedCircleIcon
                        fontSize={"large"}
                        color={"primary"}
                        onClick={() => handleDeleteUser(user.id)}
                      />
                      <CancelRoundedIcon
                        fontSize={"large"}
                        color={"error"}
                        onClick={() => setOpenModalId(null)}
                      />
                    </div>
                  </Typography>
                </Box>
              </Modal>
            </div>
          ))}
      </div>
    </div>
  );
}
