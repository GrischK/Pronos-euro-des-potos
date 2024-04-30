export interface PredictionInterface {
  matchId: number;
  user: number;
  homeTeamScorePrediction: number;
  awayTeamScorePrediction: number;
}

export interface CardProps {
  userId: number;
  matchId: number;
  matchGroup: string | undefined | null;
  matchUtcDate: string | undefined | null;
  matchStatus: string | undefined | null;
  homeTeamCrest: string | undefined | null;
  homeTeamName: string | undefined | null;
  awayTeamCrest: string | undefined | null;
  awayTeamName: string | undefined | null;
  homeTeamScore: number | undefined | null;
  awayTeamScore: number | undefined | null;
  userPrediction: any | undefined | null;
  updateComponent: () => void;
  predictionIsActivated: boolean | undefined;
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
  userProfile: UserProfile | undefined;
}

export interface MatchesProps {
  userId: number;
  groupPredictionsAreActivated: boolean | undefined;
  roundOf16PredictionsAreActivated: boolean | undefined;
  quarterPredictionsAreActivated: boolean | undefined;
  semiFinalsPredictionsAreActivated: boolean | undefined;
  finalPredictionsAreActivated: boolean | undefined;
  refreshPronos: () => void;
}

export interface PronosProps {
  refetchPronos: boolean;
}

export interface UsersListProps {
  id: number;
  name: string;
  picture: string | undefined;
  points?: number | undefined;
}

export interface MatchProps {
  id: number;
  stage: string;
  group?: string | null;
  homeTeam: {
    name: string | null;
    crest: string | null;
  };
  awayTeam: {
    name: string | null;
    crest: string | null;
  };
  status: string;
  utcDate: string;
  score: {
    winner?: string | null;
    duration: string;
    fullTime: {
      home?: number | null;
      away?: number | null;
    };
  };
}

export interface AllUsersPredictionInterface {
  id: number;
  matchId: number;
  user?:
    | {
        id: number;
        userName: string;
      }
    | null
    | undefined;
  homeTeamScorePrediction: number;
  awayTeamScorePrediction: number;
}
