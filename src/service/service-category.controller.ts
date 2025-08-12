import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import { CreateServiceCategoryDto, UpdateServiceCategoryDto } from './dto/service-category.dto';
import { ServiceCategory } from './entities/service-category.entity';

@Controller('service-categories')
export class ServiceCategoryController {
  constructor(private readonly serviceCategoryService: ServiceCategoryService) {}

  @Post()
  async create(@Body() createServiceCategoryDto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    return await this.serviceCategoryService.create(createServiceCategoryDto);
  }

  @Get()
  async findAll(): Promise<ServiceCategory[]> {
    return await this.serviceCategoryService.findAll();
  }

  @Get('admin')
  async findAllForAdmin(): Promise<ServiceCategory[]> {
    return await this.serviceCategoryService.findAllForAdmin();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ServiceCategory> {
    return await this.serviceCategoryService.findOne(id);
  }

  @Get(':id/services')
  async getServicesByCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.serviceCategoryService.getServicesByCategory(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return await this.serviceCategoryService.update(id, updateServiceCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.serviceCategoryService.remove(id);
  }
}