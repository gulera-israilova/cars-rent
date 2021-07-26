import {RentSessionEntity} from 'src/rent-sessions/entity/rent-session.entity';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class CarEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    carBrand: string;

    @Column()
    model: string;

    @Column()
    stateNumber: string;

    @Column()
    VIN: string;

    @OneToMany(() => RentSessionEntity, rent => rent.carEntity)
    rentSessions: RentSessionEntity[];
}
