import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, InputType, Int, ObjectType} from "type-graphql";

@Entity()
@ObjectType()
class User {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    userName: string;

    @Column()
    @Field()
    password: string;

    @Column({nullable: true, type: "text"})
    @Field({nullable: true})
    picture?: string;
}

@InputType()
export class UserInput {
    @Field()
    userName: string;

    @Field()
    password: string;

    @Field({nullable: true})
    picture?: string;
}

export default User;