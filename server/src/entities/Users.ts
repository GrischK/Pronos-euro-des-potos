import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsEmail, MinLength } from "class-validator";
import { argon2id, hash, verify } from "argon2";
import Prediction from "./Predictions";

export type Role = "user" | "admin";

@Entity()
@ObjectType()
class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field(() => String)
  @MinLength(2, {
    message: "2 caractères minimum pour le pseudo.",
  })
  userName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true, type: "text" })
  @Field(() => String, { nullable: true })
  picture?: string;

  @Column({ enum: ["user", "admin"], default: "user", nullable: true })
  @Field(() => String, { nullable: true })
  role?: Role;

  @Field(() => [Prediction], { nullable: true })
  @OneToMany(() => Prediction, (p) => p.user, { onDelete: "CASCADE" })
  prediction?: Prediction[];

  @Field({ nullable: true })
  @Column({ nullable: true, type: "text" })
  changePasswordToken?: string;
}

@InputType()
export class UserInput {
  @Field()
  userName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8, {
    message: "8 caractères minimum pour le mot de passe.",
  })
  password: string;

  @Field({ nullable: true })
  picture?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  userName?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @MinLength(8, {
    message: "8 caractères minimum pour le mot de passe.",
  })
  password?: string;

  @Field({ nullable: true })
  picture?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8, {
    message: "8 caractères minimum pour le mot de passe.",
  })
  password: string;
}

@InputType()
export class UserSendPassword {
  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  token?: string;
}

@InputType()
export class UserChangePassword {
  @Field()
  id: number;

  @Field()
  @IsEmail()
  newPassword: string;
}

@InputType()
export class UserChangePasswordId {
  @Field()
  id: number;
}

const hashingOptions = {
  type: argon2id,
  timeCost: 5,
  memoryCost: 2 ** 16,
};

export async function hashPassword(plainPassword: string): Promise<string> {
  return await hash(plainPassword, hashingOptions);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await verify(hashedPassword, plainPassword, hashingOptions);
}

export const getSafeAttributes = (user: User): User => ({
  ...user,
  hashedPassword: "",
});

export default User;
