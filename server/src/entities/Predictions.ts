import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import User from "./Users";

@Entity()
@ObjectType()
@Unique(["matchId", "user"])
class Prediction {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: "match_id" })
  @Field(() => Int)
  matchId: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (u) => u.prediction, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  user?: User;

  @Column({ name: "home_team_score_prediction" })
  @Field(() => Int)
  homeTeamScorePrediction: number;

  @Column({ name: "away_team_score_prediction" })
  @Field(() => Int)
  awayTeamScorePrediction: number;
}

@InputType()
export class CreatePredictionInput {
  @Field(() => Int)
  matchId: number;

  @Field(() => Int, { nullable: true })
  user?: number;

  @Field(() => Int)
  homeTeamScorePrediction: number;

  @Field(() => Int)
  awayTeamScorePrediction: number;
}

@InputType()
export class UpdatePredictionInput {
  @Field(() => Int)
  homeTeamScorePrediction: number;

  @Field(() => Int)
  awayTeamScorePrediction: number;
}

export default Prediction;
