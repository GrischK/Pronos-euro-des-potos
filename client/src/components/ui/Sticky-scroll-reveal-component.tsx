import React from "react";
import { StickyScroll } from "./Sticky-scroll-reveal";

export function StickyScrollRevealDemo({ contentData }: any) {
  const modifiedContent = [...contentData, {}, {}]; // Ajoute un élément à contentData

  const content = modifiedContent.map((tab: any, index: number) => ({
    title: tab.name,
    description: `${tab.points} points`,
    id: tab.id,
    content: (
      <div className="h-full w-full bg-[#020617] flex items-center justify-center text-white flex-col">
        <img
          className="rounded-full h-[20vh] w-[20vh] object-cover"
          src={tab.picture}
          alt={tab.name}
        />
        <span>{index + 1 === 1 ? `${index + 1}er` : `${index + 1}ème`}</span>
      </div>
    ),
  }));

  return (
    <div className="md:p-10">
      <StickyScroll content={content} />
    </div>
  );
}
