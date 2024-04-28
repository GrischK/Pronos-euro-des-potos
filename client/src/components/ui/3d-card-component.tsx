import React from "react";
import { CardBody, CardContainer, CardItem } from "./3d-card";

export default function ThreeDCardDemo({ points }: any) {
  return (
    <CardContainer className="inter-var cursor-pointer">
      <CardBody className="flex flex-col justify-center items-center relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] sm:w-[15vh] sm:h-[15vh] rounded-full p-6 border bg-[#0f172a] border-solid border-white border-opacity-20">
        <CardItem
          translateZ="100"
          className="w-full text-center flex flex-col justify-center items-center"
        >
          <span className={"text-6xl text-white"}>{points}</span>
          <span className={"text-1xl text-white"}>points</span>{" "}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
