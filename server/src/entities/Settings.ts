import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, InputType, Int, ObjectType} from "type-graphql";

@Entity()
@ObjectType()
class AppSetting {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({name: 'predictions_are_activated', default: true})
    @Field(() => Boolean)
    predictionsAreActivated: boolean;
}

@InputType()
export class SetAppStatusInput {
    @Field(() => Boolean)
    predictionsAreActivated: boolean;
}

export default AppSetting;