import {cn} from "../../utils/cn";
import React, {useState} from "react";
import {motion} from "framer-motion";
import styles from "../MatchCard/MatchCard.module.css";
import GradientButton from "../GradientButton/GradientButton";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {PredictionInterface} from "../../interfaces/MatchCard.interface";
import {useCreatePredictionMutation, useUpdatePredictionMutation} from "../../gql/generated/schema";
import {GradientInput} from "./Gradient-input";
import {boxStyle, modalStyle} from "../../utils/styles";
import {AnimatedTooltip} from "./Animated-tooltip";

export const GradientCard = ({
                                 className,
                                 containerClassName,
                                 animate = true,
                                 style,
                                 userId,
                                 matchId,
                                 matchGroup,
                                 matchUtcDate,
                                 matchStatus,
                                 homeTeamCrest,
                                 homeTeamName,
                                 awayTeamCrest,
                                 awayTeamName,
                                 homeTeamScore,
                                 awayTeamScore,
                                 userPrediction,
                                 updateComponent,
                                 predictionIsActivated
                             }: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    animate?: boolean;
    style?: {};
    userId: number,
    matchId: number,
    matchGroup: string | undefined | null,
    matchUtcDate: string | undefined | null,
    matchStatus: string | undefined | null,
    homeTeamCrest: string | undefined | null,
    homeTeamName: string | undefined | null,
    awayTeamCrest: string | undefined | null,
    awayTeamName: string | undefined | null,
    homeTeamScore: number | undefined | null,
    awayTeamScore: number | undefined | null,
    userPrediction: any | undefined | null,
    updateComponent: () => void,
    predictionIsActivated: boolean | undefined
}) => {
    const [newPrediction, setNewPrediction] = useState<PredictionInterface>({
        matchId: matchId,
        user: userId,
        homeTeamScorePrediction: 0,
        awayTeamScorePrediction: 0,
    });

    const [inputIsShownn, setInputIsShown] = useState(true)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    console.log(matchId, inputIsShownn)

    const [createPrediction] = useCreatePredictionMutation()
    const [updatePrediction] = useUpdatePredictionMutation()


    const onClickCreateNewGame = async () => {
        await createPrediction({
            variables: {
                data: {
                    matchId: newPrediction.matchId,
                    user: newPrediction.user,
                    homeTeamScorePrediction: newPrediction.homeTeamScorePrediction,
                    awayTeamScorePrediction: newPrediction.awayTeamScorePrediction,
                },
            },
        });
        updateComponent()
        setInputIsShown(false)
    }

    const onClickUpdateGame = async () => {
        await updatePrediction({
            variables: {
                updatePredictionId: userPrediction.id,
                data: {
                    homeTeamScorePrediction: newPrediction.homeTeamScorePrediction,
                    awayTeamScorePrediction: newPrediction.awayTeamScorePrediction
                }
            },
        });
        updateComponent()
        handleClose()
    }

    function formatDate(dateString: string) {
        const options: Intl.DateTimeFormatOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
    }

    function formatString(groupName: string) {
        return groupName.replace("_", ' ')
    }

    console.log(userPrediction)
    const variants = {
        initial: {
            backgroundPosition: "0 50%",
        },
        animate: {
            backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
        },
    };
    return (
        <div className={cn("relative p-[4px] group cursor-pointer text-white", containerClassName)} style={style}>
            <motion.div
                variants={animate ? variants : undefined}
                initial={animate ? "initial" : undefined}
                animate={animate ? "animate" : undefined}
                transition={
                    animate
                        ? {
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }
                        : undefined
                }
                style={{
                    backgroundSize: animate ? "400% 400%" : undefined,
                }}
                className={cn(
                    "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform",
                    "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
                )}
            />
            <motion.div
                variants={animate ? variants : undefined}
                initial={animate ? "initial" : undefined}
                animate={animate ? "animate" : undefined}
                transition={
                    animate
                        ? {
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }
                        : undefined
                }
                style={{
                    backgroundSize: animate ? "400% 400%" : undefined,
                }}
                className={cn(
                    "absolute inset-0 rounded-3xl z-[1] will-change-transform",
                    "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
                )}
            />

            <div className={cn("relative z-10 h-full", className)}>
                <div
                    key={matchId}
                    className={styles.gradient_card}
                >
                    {matchGroup && (
                        <span>{formatString(matchGroup)}</span>
                    )}
                    {matchUtcDate && (
                        <span>{formatDate(matchUtcDate)}</span>
                    )}
                    {matchStatus !== 'FINISHED' ? 'A venir' : 'Terminé'}
                    <div className={styles.card_teams}>
                        <div className={styles.container}>
                            <div className={styles.team_details}>
                                {
                                    homeTeamCrest && homeTeamName ?
                                        <img src={homeTeamCrest} alt={homeTeamName}/>
                                        :
                                        null
                                }
                                <span className={styles.team_name}>{homeTeamName}</span>
                                <span className={styles.team_score}>{homeTeamScore}</span>
                            </div>
                            <div className={styles.team_details}>
                                {
                                    awayTeamCrest && awayTeamName ?
                                        <img src={awayTeamCrest} alt={awayTeamName}/>
                                        :
                                        null
                                }
                                <span className={styles.team_name}>{awayTeamName}</span>
                                <span className={styles.team_score}>{awayTeamScore}</span>
                            </div>
                        </div>

                        <span className={styles.match_prono}>Mon prono</span>
                        <div className={styles.container}>
                            <div className={styles.input_wrapper}>
                                {/*<label htmlFor="home-team">*/}
                                {/*    /!*{homeTeamName}*!/*/}
                                {/*</label>*/}
                                <GradientInput
                                    className={"font-bold text-2xl"}
                                    type="text"
                                    value={userPrediction?.homeTeamScorePrediction | newPrediction.homeTeamScorePrediction}
                                    onChange={(e) =>
                                        setNewPrediction((prevState) => ({
                                            ...prevState,
                                            homeTeamScorePrediction: Number(e.target.value),
                                        }))
                                    }
                                    disabled={userPrediction?.homeTeamScorePrediction !== undefined || !predictionIsActivated}
                                />
                            </div>
                            <div className={styles.input_wrapper}>
                                {/*<label htmlFor="home-team">*/}
                                {/*    /!*{awayTeamName}*!/*/}
                                {/*</label>*/}
                                <GradientInput
                                    className={"font-bold text-2xl"}
                                    type="text"
                                    value={userPrediction?.awayTeamScorePrediction | newPrediction.awayTeamScorePrediction}
                                    onChange={(e) =>
                                        setNewPrediction((prevState) => ({
                                            ...prevState,
                                            awayTeamScorePrediction: Number(e.target.value),
                                        }))
                                    }
                                    disabled={userPrediction?.awayTeamScorePrediction !== undefined || !predictionIsActivated}
                                />
                            </div>
                        </div>
                        {(userPrediction?.awayTeamScorePrediction === undefined && userPrediction?.homeTeamScorePrediction === undefined) && predictionIsActivated
                            ?
                            <button className="p-[3px] relative"
                                    onClick={onClickCreateNewGame}>
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"/>
                                <div
                                    className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                                    OK
                                </div>
                            </button>
                            // <GradientButton onClick={onClickCreateNewGame}>OK</GradientButton>
                            :
                            null
                        }
                        {(userPrediction?.awayTeamScorePrediction !== undefined && userPrediction?.homeTeamScorePrediction !== undefined) && predictionIsActivated
                            ?

                            <div className={styles.icon_container}>
                                <AnimatedTooltip items={"Modifier mon prono"}>
                                    <EditIcon className={styles.modify_prediction} onClick={handleOpen}/>
                                </AnimatedTooltip>
                            </div>
                            :
                            null
                        }
                        <Modal
                            sx={modalStyle}
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={boxStyle}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Modifier mon prono
                                </Typography>
                                <Typography id="modal-modal-description" sx={{mt: 2}}>
                                    <div className={styles.container}>
                                        <div className={styles.input_container}>
                                            <label htmlFor="home-team">{homeTeamName}</label>
                                            <input className={styles.prediction_input} type="text"
                                                   value={newPrediction.homeTeamScorePrediction}
                                                   onChange={(e) =>
                                                       setNewPrediction((prevState) => ({
                                                           ...prevState,
                                                           homeTeamScorePrediction: Number(e.target.value),
                                                       }))
                                                   }
                                            />
                                        </div>
                                        <div className={styles.input_container}>
                                            <label htmlFor="home-team">{awayTeamName}</label>
                                            <input className={styles.prediction_input} type="text"
                                                   value={newPrediction.awayTeamScorePrediction}
                                                   onChange={(e) =>
                                                       setNewPrediction((prevState) => ({
                                                           ...prevState,
                                                           awayTeamScorePrediction: Number(e.target.value),
                                                       }))
                                                   }
                                            />
                                        </div>
                                        <GradientButton onClick={onClickUpdateGame}>OK</GradientButton>
                                    </div>
                                </Typography>
                            </Box>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};
