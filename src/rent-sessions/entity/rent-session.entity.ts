import {CarEntity} from 'src/cars/entity/car.entity';
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Tariff} from "../enum/tarrif.enum";

@Entity()
export class RentSessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: Tariff,
        default: Tariff.FIRST
    })
    tariff: Tariff;

    @Column()
    startedAt: Date;

    @Column()
    endedAt: Date;

    @ManyToOne(() => CarEntity, car => car.rentSessions)
    @JoinColumn()
    car: CarEntity;
}
