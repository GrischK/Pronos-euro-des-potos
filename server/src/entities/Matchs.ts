import {Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, InputType, Int, ObjectType} from "type-graphql";
import Team from "./Teams";


@Entity()
@ObjectType()
class Match {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Field(() => Team)
    @ManyToOne(() => Team, (t) => t.id)
    @JoinTable()
    teamA: Team;

    @Field(() => Team)
    @ManyToOne(() => Team, (t) => t.id)
    @JoinTable()
    teamB: Team;

    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    scoreA?: string;

    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    scoreB?: string;

    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    date?: string;
}

@InputType()
export class CreateMatchInput {
    @Field(() => Int)
    teamA: number;

    @Field(() => Int)
    teamB: number;

    @Field(() => String, {nullable: true})
    scoreA?: string;

    @Field(() => String, {nullable: true})
    scoreB?: string;
}

@InputType()
export class PronoInput {
    @Field(() => String)
    scoreA: string;

    @Field(() => String)
    scoreB: string;
}

@ObjectType()
class MatchTeam {
    @Field({nullable: true})
    id?: number;

    @Field({nullable: true})
    name?: string;

    @Field({nullable: true})
    shortName?: string;

    @Field({nullable: true})
    tla?: string;

    @Field({nullable: true})
    crest?: string;
}

@ObjectType()
class MatchFullTime {
    @Field({nullable: true})
    home?: string;

    @Field({nullable: true})
    away?: string;
}

@ObjectType()
class MatchScore {
    @Field({nullable: true})
    winner?: string;

    @Field({nullable: true})
    duration?: string;

    @Field({nullable: true})
    fullTime?: MatchFullTime;
}

@ObjectType()
export class MatchData {
    @Field()
    id: number;

    @Field({nullable: true})
    utcDate?: string;

    @Field({nullable: true})
    status?: string;

    @Field({nullable: true})
    group?: string;

    @Field({nullable: true})
    homeTeam?: MatchTeam;

    @Field({nullable: true})
    awayTeam?: MatchTeam;

    @Field({nullable: true})
    score?: MatchScore;
}

export default Match;