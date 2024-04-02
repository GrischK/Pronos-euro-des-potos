import styles from "./Matches.module.css"
import {useFetchMatchesFromApiQuery} from "../../gql/generated/schema";

export default function Matches() {
    const {data: matches} = useFetchMatchesFromApiQuery()
    const matchList = matches && matches.fetchMatchesFromAPI;
    console.log(matchList)

    function formatDate(dateString: string) {
        const options: Intl.DateTimeFormatOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
    }

    function formatString(groupName:string) {
        return groupName.replace("_",' ')
    }

    return (
        <div className={styles.macthes}>
            {matchList && matchList.map((match) =>
                <div
                    key={match.id}
                    className={styles.match_card}
                >
                    {match.group && (
                        <span>{formatString(match.group)}</span>
                    )}
                    {match.utcDate && (
                        <span>{formatDate(match.utcDate)}</span>
                    )}
                    {match.status!=='FINISHED' ? 'A venir' : 'Terminé'}
                    <div className={styles.card_teams}>
                        <div className={styles.team_details}>
                            {
                                match.homeTeam?.crest && match.homeTeam?.name ?
                                    <img src={match.homeTeam?.crest} alt={match.homeTeam?.name}/>
                                    :
                                    null
                            }
                            <span className={styles.team_name}>{match.homeTeam?.name}</span>
                            <span className={styles.team_score}>{match.score?.fullTime?.home}</span>

                        </div>
                        <div className={styles.team_details}>
                            {
                                match.awayTeam?.crest && match.awayTeam?.name ?
                                    <img src={match.awayTeam?.crest} alt={match.awayTeam?.name}/>
                                    :
                                    null
                            }
                            <span className={styles.team_name}>{match.awayTeam?.name}</span>
                            <span className={styles.team_score}>{match.score?.fullTime?.away}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}