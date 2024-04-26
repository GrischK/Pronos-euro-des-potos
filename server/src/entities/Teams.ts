import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
class Team {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  flag: string;

  @Column()
  @Field(() => String)
  group: string;
}

@InputType()
export class CreateTeamInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  flag: string;

  @Field(() => String)
  group: string;
}

export default Team;
