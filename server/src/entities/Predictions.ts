import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, InputType, Int, ObjectType} from "type-graphql";

@Entity()
@ObjectType()
class Prediction {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({name:'match_id'})
    @Field(() => Int)
    matchId: number;

    @Column({name:'user_id'})
    @Field(() => Int)
    userId: number;

    @Column({name:'home_team_score_prediction'})
    @Field(() => String)
    homeTeamScorePrediction: string;

    @Column({name:'away_team_score_prediction'})
    @Field(() => String)
    awayTeamScorePrediction: string;
}

@InputType()
export class CreatePredictionInput {
    @Field(() => Int)
    matchId: number;

    @Field(() => Int)
    userId: number;

    @Field(() => String)
    homeTeamScorePrediction: string;

    @Field(() => String)
    awayTeamScorePrediction: string;
}

export default Prediction;