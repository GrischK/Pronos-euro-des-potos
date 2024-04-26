import * as React from "react";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";

export default function CustomTooltip() {
  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 14,
    },
  }));

  return (
    <LightTooltip
      TransitionComponent={Zoom}
      title="Impossible de saisir tes pronos"
    >
      <LockIcon />
    </LightTooltip>
  );
}
