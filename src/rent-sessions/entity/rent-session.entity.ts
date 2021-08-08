import {CarEntity} from 'src/cars/entity/car.entity';
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Tariff} from "../enum/tarrif.enum";
import {ValidateNested} from "class-validator";

@Entity()
export class RentSessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: Tariff,
        default: Tariff.TRIP
    })
    tariff: Tariff;

    @Column()
    startedAt: Date;

    @Column()
    endedAt: Date;

    @ValidateNested({ each: true })
    @ManyToOne(
        () => CarEntity,
        car => car.rentSessions,
        {
            eager: true
        })
    @JoinColumn()
    car: CarEntity;

    @JoinColumn()
    price: Number;

    @JoinColumn()
    kilometrage: Number;
}
