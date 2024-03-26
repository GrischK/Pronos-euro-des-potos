import {Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
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

export default Match;