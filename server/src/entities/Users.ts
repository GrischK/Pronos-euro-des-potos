import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, InputType, Int, ObjectType} from "type-graphql";
import {IsEmail, MinLength} from "class-validator";
import {argon2id, hash, verify} from "argon2";

@Entity()
@ObjectType()
class User {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({unique: true})
    @Field(() => String)
    userName: string;

    @Column({unique: true})
    @Field(() => String)
    email: string;

    @Column()
    hashedPassword: string;

    @Column({nullable: true, type: "text"})
    @Field(() => String, {nullable: true})
    picture?: string;
}

@InputType()
export class UserInput {
    @Field()
    userName: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @MinLength(8)
    password: string;

    @Field({nullable: true})
    picture?: string;
}

@InputType()
export class UpdateUserInput {
    @Field({nullable: true})
    userName?: string;

    @Field({nullable: true})
    @IsEmail()
    email?: string;

    @Field({nullable: true})
    @MinLength(8)
    password?: string;

    @Field({nullable: true})
    picture?: string;
}

@InputType()
export class LoginInput {
    @Field()
    @IsEmail()
    email: string

    @Field()
    password: string
}


const hashingOptions = {
    type: argon2id,
    timeCost: 5,
    memoryCost: 2 ** 16
}

export async function hashPassword(plainPassword: string): Promise<string> {
    return await hash(plainPassword, hashingOptions)
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await verify(hashedPassword, plainPassword, hashingOptions)
}

export default User;