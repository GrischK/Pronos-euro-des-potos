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

    @Column({name: 'predictions_round_of_16_activated', default: true})
    @Field(() => Boolean)
    predictionsRoundOf16Activated: boolean;

    @Column({name: 'predictions_quarter_finales_activated', default: true})
    @Field(() => Boolean)
    predictionsQuarterFinalsActivated: boolean;

    @Column({name: 'predictions_semi_finales_activated', default: true})
    @Field(() => Boolean)
    predictionsSemiFinalsActivated: boolean;

    @Column({name: 'predictions_final_activated', default: true})
    @Field(() => Boolean)
    predictionsFinalActivated: boolean;
}

@InputType()
export class SetAppStatusInput {
    @Field(() => Boolean)
    predictionsAreActivated: boolean;
}

export default AppSetting;