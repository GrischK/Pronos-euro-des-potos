import React from "react";
import { StickyScroll } from "./Sticky-scroll-reveal";

export function StickyScrollRevealDemo({ contentData }: any) {
  const modifiedContent = [...contentData, {}, {}]; // Ajoute un élément à contentData

  const rankings: { [points: number]: number } = {};

  console.log(rankings);
  // On détermine la position dans le classement en fonction des points
  // Comme ça si les potos ont le même nombre de points, ils sont ex aequo dans le classment
  modifiedContent.forEach((contentInfo: any, index: number) => {
    const points = contentInfo.points;
    if (rankings[points] === undefined) {
      rankings[points] = index + 1;
    }
  });

  const content = modifiedContent.map((contentInfo: any, index: number) => ({
    title: contentInfo.name,
    rank: `${rankings[contentInfo.points]}${rankings[contentInfo.points] === 1 ? "er" : "ème"}`,
    description: `${contentInfo.points} points`,
    id: contentInfo.id,
    content: (
      <div className="h-full w-full bg-[#020617] flex items-center justify-center text-white flex-col">
        <img
          className="rounded-full h-[20vh] w-[20vh] object-cover"
          src={contentInfo.picture ? contentInfo.picture : "/bg.png"}
          alt={contentInfo.name}
        />
      </div>
    ),
  }));

  return (
    <div className="md:p-10 md:pt-0">
      <StickyScroll content={content} />
    </div>
  );
}
