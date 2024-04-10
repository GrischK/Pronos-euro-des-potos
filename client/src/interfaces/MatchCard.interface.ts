export interface PredictionInterface {
    matchId: number,
    user: number,
    homeTeamScorePrediction: number,
    awayTeamScorePrediction: number
}


export interface CardProps {
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
    updateComponent: () => void
}