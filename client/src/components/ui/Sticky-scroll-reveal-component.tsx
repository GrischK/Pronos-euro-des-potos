import React from "react";
import { StickyScroll } from "./Sticky-scroll-reveal";
import CountUp from "react-countup";

export function StickyScrollRevealDemo({ contentData }: any) {
  const content = contentData.map((tab: any, index: number) => ({
    title: `${index + 1}. ${tab.name}`,
    value: tab.name,
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold text-white">
        <div className={"text-white"}>
          <CountUp
            className={"text-6xl"}
            start={0}
            end={tab.points || 0}
            duration={2.5}
            delay={1}
          />
          <span className={"text-2xl"}> points</span>
        </div>
        <img
          src={tab.picture}
          alt="dummy image"
          className="object-cover h-[20vh] absolute inset-x-0 w-[20vh] rounded-full mx-auto"
        />
      </div>
    ),
  }));

  return (
    <div className="p-10">
      <StickyScroll content={content} />
    </div>
  );
}
