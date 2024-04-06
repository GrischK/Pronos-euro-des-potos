import {Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, InputType, Int, ObjectType} from "type-graphql";
import User from "./Users";

@Entity()
@ObjectType()
class Prediction {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({name: 'match_id'})
    @Field(() => Int)
    matchId: number;

    // @Column({name:'user_id'})
    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, (u) => u.prediction, {eager: true, cascade: true, onDelete: "CASCADE"})
    // @JoinTable({ name: "userId" })
    @JoinTable()
    user?: User;

    // @Column({ nullable: true, type: "int" })
    // userId?: number;

    @Column({name: 'home_team_score_prediction'})
    @Field(() => Int)
    homeTeamScorePrediction: number;

    @Column({name: 'away_team_score_prediction'})
    @Field(() => Int)
    awayTeamScorePrediction: number;
}

@InputType()
export class CreatePredictionInput {
    @Field(() => Int)
    matchId: number;

    @Field(() => Int, {nullable: true})
    user?: number;

    @Field(() => Int)
    homeTeamScorePrediction: number;

    @Field(() => Int)
    awayTeamScorePrediction: number;
}

export default Prediction;