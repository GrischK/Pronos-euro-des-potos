import React from "react";
import {Meteors} from "./Meteor";

interface MeteorCardProps {
    matchInfo: any,
    matchPredictions: any
}

export function MeteorCard({matchInfo, matchPredictions}: MeteorCardProps) {
    // console.log(matchInfo)
    // console.log(matchPredictions)
    return (
        <div className="">
            <div className=" w-full relative max-w-xs">
                <div
                    className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl"/>
                <div
                    className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
                    <h1 className="font-bold text-xl text-white mb-4 relative z-50">
                        {matchInfo.homeTeam.name}
                        -
                        {matchInfo.awayTeam.name}
                    </h1>

                    <div className="font-normal text-base text-slate-500 mb-4 relative z-50">
                        Pronos de tous les potos :
                        {matchPredictions.map((prediction: any) => (
                            <div key={prediction.id}>
                                {prediction.user.userName}
                                {prediction.homeTeamScorePrediction}
                                -
                                {prediction.awayTeamScorePrediction}
                            </div>
                        ))}

                    </div>

                    {/* Meaty part - Meteor effect */}
                    <Meteors number={20}/>
                </div>
            </div>
        </div>
    );
}
