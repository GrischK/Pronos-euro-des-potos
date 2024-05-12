import React from "react";
import { StickyScroll } from "./Sticky-scroll-reveal";

export function StickyScrollRevealDemo({ contentData }: any) {
  const modifiedContent = [...contentData, {}, {}]; // Ajoute un élément à contentData

  const content = modifiedContent.map((contentInfo: any, index: number) => ({
    title: contentInfo.name,
    rank: index + 1 === 1 ? `${index + 1}er` : `${index + 1}ème`,
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
    <div className="md:p-10">
      <StickyScroll content={content} />
    </div>
  );
}
