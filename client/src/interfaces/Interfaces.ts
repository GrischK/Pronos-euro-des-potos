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
    updateComponent: () => void,
    predictionIsActivated: boolean | undefined
}

export interface UserProfile {
    id: number;
    email: string;
    userName: string;
    picture?: string | null;
    role?: string | null;
}

export interface ProfileProps {
    userProfile: UserProfile | undefined;
    refreshUserProfile: () => void;
}

export interface HomePageProps {
    handlePredictionSetting: () => void,
    app: boolean | undefined,
    userProfile: UserProfile | undefined;
}

export interface MatchesProps {
    userId: number,
    predictionsAreActivated: boolean | undefined,
    refreshPronos: () => void,
}


export interface PronosProps {
    refetchPronos: boolean,
}