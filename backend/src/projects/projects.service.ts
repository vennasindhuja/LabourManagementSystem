import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(search?: string, status?: string): Promise<Project[]> {
    const query = this.projectRepository.createQueryBuilder('project');

    if (search) {
      query.andWhere(
        '(LOWER(project.name) LIKE LOWER(:search) OR LOWER(project.location) LIKE LOWER(:search) OR LOWER(project.clientName) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (status && status !== 'All') {
      query.andWhere('project.status = :status', { status });
    }

    query.orderBy('project.id', 'ASC');
    return await query.getMany();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['attendances'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(dto);
    return await this.projectRepository.save(project);
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, dto);
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<{ message: string }> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
    return { message: `Project #${id} removed successfully` };
  }
}
