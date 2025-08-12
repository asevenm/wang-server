import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { Service } from './entities/service.entity';
import { CreateServiceCategoryDto, UpdateServiceCategoryDto } from './dto/service-category.dto';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private serviceCategoryRepository: Repository<ServiceCategory>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceCategoryDto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const category = this.serviceCategoryRepository.create(createServiceCategoryDto);
    return await this.serviceCategoryRepository.save(category);
  }

  async findAll(): Promise<ServiceCategory[]> {
    return await this.serviceCategoryRepository.find({
      where: { is_active: true },
      order: { sort_order: 'ASC', created_at: 'DESC' },
      relations: ['services', 'services.images'],
    });
  }

  async findAllForAdmin(): Promise<ServiceCategory[]> {
    return await this.serviceCategoryRepository.find({
      order: { sort_order: 'ASC', created_at: 'DESC' },
      relations: ['services', 'services.images'],
    });
  }

  async findOne(id: number): Promise<ServiceCategory> {
    const category = await this.serviceCategoryRepository.findOne({
      where: { id },
      relations: ['services', 'services.images'],
    });

    if (!category) {
      throw new NotFoundException(`Service category with ID ${id} not found`);
    }

    return category;
  }

  async getServicesByCategory(categoryId: number) {
    const services = await this.serviceRepository.find({
      where: { 
        category_id: categoryId,
        is_active: true 
      },
      order: { sort_order: 'ASC', created_at: 'DESC' },
      relations: ['images'],
    });

    return { data: services };
  }

  async update(id: number, updateServiceCategoryDto: UpdateServiceCategoryDto): Promise<ServiceCategory> {
    const category = await this.findOne(id);
    Object.assign(category, updateServiceCategoryDto);
    return await this.serviceCategoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.serviceCategoryRepository.remove(category);
  }
}