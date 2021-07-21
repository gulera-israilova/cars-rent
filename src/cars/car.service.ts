import {Injectable} from "@nestjs/common";
import {Repository, UpdateResult} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UpdateCarDto} from "./dto/update-car.dto";
import {CarEntity} from "./entity/car.entity";

@Injectable()
export class CarService {

    constructor(
        @InjectRepository(CarEntity)
        private carsRepository: Repository<CarEntity>,
    ) {
    }

    index(): Promise<CarEntity[]> {
        return this.carsRepository.find();
    }

    show(id: string): Promise<CarEntity> {
        return this.carsRepository.findOne(id);
    }

    async destroy(id: string): Promise<void> {
        await this.carsRepository.delete(id);
    }

    async create(createCarDto): Promise<CarEntity[]> {
        return this.carsRepository.save(createCarDto)
    }

    async update(id: string, cartDto: UpdateCarDto): Promise<UpdateResult> {
        return this.carsRepository.update(id, cartDto)
    }
}