export const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
};

export const boxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2vh",
  justifyContent: "center",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#020617",
  boxShadow: 24,
  p: 4,
  color: "white",
  borderRadius: 4,
  border: "2px solid #0b194b",
};

export const typoStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2vh",
};

export const updatePronoContainer = {
  ...typoStyle,
  marginTop: "2vh",
};

export const errorToast = {
  color: "white",
  width: "100%",
  borderRadius: "2vh",
  overflow: "hidden",
  border: "2px solid #0b194b",
  bgcolor: "#020617",
};

export const matchesPredictionsMissedModalBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2vh",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "70px",
  width: "70vw",
  bgcolor: "#020617",
  boxShadow: 24,
  p: 4,
  color: "white",
  borderRadius: 4,
  border: "2px solid #0b194b",
  maxHeight: "80vh",
  overflowY: "scroll",
  padding: "2vh 1vw",
};
