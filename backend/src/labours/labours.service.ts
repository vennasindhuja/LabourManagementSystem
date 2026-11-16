import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Labour, LabourStatus } from './entities/labour.entity';
import { CreateLabourDto } from './dto/create-labour.dto';
import { UpdateLabourDto } from './dto/update-labour.dto';

@Injectable()
export class LaboursService {
  constructor(
    @InjectRepository(Labour)
    private readonly labourRepository: Repository<Labour>,
  ) {}

  async findAll(search?: string, trade?: string, status?: string): Promise<Labour[]> {
    const query = this.labourRepository.createQueryBuilder('labour');

    if (search) {
      query.andWhere(
        '(LOWER(labour.firstName) LIKE LOWER(:search) OR LOWER(labour.lastName) LIKE LOWER(:search) OR labour.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (trade && trade !== 'All') {
      query.andWhere('labour.trade = :trade', { trade });
    }

    if (status && status !== 'All') {
      query.andWhere('labour.status = :status', { status });
    }

    query.orderBy('labour.id', 'ASC');
    return await query.getMany();
  }

  async findOne(id: number): Promise<Labour> {
    const labour = await this.labourRepository.findOne({
      where: { id },
      relations: ['attendances', 'payrolls'],
    });
    if (!labour) {
      throw new NotFoundException(`Labour with ID ${id} not found`);
    }
    return labour;
  }

  async create(dto: CreateLabourDto): Promise<Labour> {
    const labour = this.labourRepository.create(dto);
    return await this.labourRepository.save(labour);
  }

  async update(id: number, dto: UpdateLabourDto): Promise<Labour> {
    const labour = await this.findOne(id);
    Object.assign(labour, dto);
    return await this.labourRepository.save(labour);
  }

  async remove(id: number): Promise<{ message: string }> {
    const labour = await this.findOne(id);
    await this.labourRepository.remove(labour);
    return { message: `Labour #${id} removed successfully` };
  }

  async getTrades(): Promise<string[]> {
    const result = await this.labourRepository
      .createQueryBuilder('labour')
      .select('DISTINCT labour.trade', 'trade')
      .getRawMany();
    return result.map((r) => r.trade).filter(Boolean);
  }
}
