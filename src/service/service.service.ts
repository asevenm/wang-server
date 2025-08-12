import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServiceImage } from './entities/service-image.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceImage)
    private readonly serviceImageRepository: Repository<ServiceImage>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const { images, ...serviceData } = createServiceDto;
    // 创建服务
    const service = this.serviceRepository.create(serviceData);
    const savedService = await this.serviceRepository.save(service);
    // 创建服务图片
    if (images && images.length > 0) {
      const serviceImages = images.map((img, index) =>
        this.serviceImageRepository.create({
          ...img,
          service_id: savedService.id,
          sort_order: img.sort_order || index,
        }),
      );
      await this.serviceImageRepository.save(serviceImages);
    }
    return await this.findOne(savedService.id);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find({
      where: { is_active: true },
      order: { sort_order: 'ASC', created_at: 'DESC' },
      relations: ['category', 'images'],
    });
  }

  async findAllForAdmin(): Promise<Service[]> {
    return await this.serviceRepository.find({
      order: { sort_order: 'ASC', created_at: 'DESC' },
      relations: ['category', 'images'],
    });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['category', 'images'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const { images, ...serviceData } = updateServiceDto;
    const service = await this.findOne(id);
    // 更新服务基本信息
    Object.assign(service, serviceData);
    await this.serviceRepository.save(service);
    // 更新图片信息
    if (images !== undefined) {
      // 删除旧图片
      await this.serviceImageRepository.delete({ service_id: id });
      // 添加新图片
      if (images.length > 0) {
        const serviceImages = images.map((img, index) =>
          this.serviceImageRepository.create({
            ...img,
            service_id: id,
            sort_order: img.sort_order || index,
          }),
        );
        await this.serviceImageRepository.save(serviceImages);
      }
    }
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }
}
