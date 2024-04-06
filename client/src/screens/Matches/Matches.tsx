import styles from "./Matches.module.css"
import { useFetchMatchesFromApiQuery} from "../../gql/generated/schema";
import MatchCard from "../../components/MatchCard/MatchCard";

export interface MatchesProps {
    userId: number,
}

export default function Matches({userId}:MatchesProps) {
    const {data: matches} = useFetchMatchesFromApiQuery()
    const matchList = matches && matches.fetchMatchesFromAPI;
    console.log(matchList)


    return (
        <div className={styles.macthes}>
            {matchList && matchList.map((match) =>
                <MatchCard
                    key={match.id}
                    userId={userId}
                    matchId={match.id}
                    matchGroup={match.group}
                    matchUtcDate={match.utcDate}
                    matchStatus={match.status}
                    homeTeamCrest={match.homeTeam?.crest}
                    homeTeamName={match.homeTeam?.name}
                    awayTeamCrest={match.awayTeam?.crest}
                    awayTeamName={match.awayTeam?.name}
                    homeTeamScore={match.score?.fullTime?.home}
                    awayTeamScore={match.score?.fullTime?.away}
                />
                    )}
                </div>
            )
            }